import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number and special character'
  ),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(3).optional(),
});

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: number;
  email: string;
  roles: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: z.infer<typeof registerSchema>) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Get default author role
    const authorRole = await prisma.roleDefinition.findUnique({
      where: { name: Role.AUTHOR },
    });

    if (!authorRole) {
      throw new Error('Default role not found');
    }

    // Create user with author role
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        roles: {
          create: {
            roleId: authorRole.id,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create audit log
    await this.createAuditLog(user.id, 'user.register', 'user', user.id.toString());

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Login user
   */
  async login(data: z.infer<typeof loginSchema>) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash!);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create audit log
    await this.createAuditLog(user.id, 'user.login', 'user', user.id.toString());

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;

      // Check if token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: {
          user: {
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(storedToken.user);

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId: number, refreshToken?: string) {
    // Delete refresh token if provided
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
          userId,
        },
      });
    }

    // Create audit log
    await this.createAuditLog(userId, 'user.logout', 'user', userId.toString());
  }

  /**
   * Verify access token
   */
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  /**
   * Get user by ID with roles and permissions
   */
  async getUserWithPermissions(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        permissions: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Collect all permissions
    const rolePermissions = user.roles.flatMap(ur =>
      ur.role.permissions.map(rp => rp.permission)
    );

    const allPermissions = [...rolePermissions, ...user.permissions];
    const uniquePermissions = Array.from(
      new Map(allPermissions.map(p => [p.name, p])).values()
    );

    return {
      ...this.sanitizeUser(user),
      permissions: uniquePermissions,
    };
  }

  /**
   * Check if user has permission
   */
  async hasPermission(userId: number, permissionName: string): Promise<boolean> {
    const user = await this.getUserWithPermissions(userId);
    return user.permissions.some(p => p.name === permissionName);
  }

  /**
   * Check if user has any of the roles
   */
  async hasRole(userId: number, roles: Role[]): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) return false;

    return user.roles.some(ur => roles.includes(ur.role.name));
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: User & { roles: any[] }): Promise<AuthTokens> {
    const roles = user.roles.map(ur => ur.role.name);
    
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      roles,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: any) {
    const { passwordHash, mfaSecret, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Create audit log entry
   */
  private async createAuditLog(
    userId: number | null,
    action: string,
    resource: string,
    resourceId?: string,
    metadata?: any
  ) {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        metadata,
      },
    });
  }
}