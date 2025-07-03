import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Define permissions for each role
const permissions = [
  // Post permissions
  { name: 'post.create', resource: 'post', action: 'create', description: 'Create new posts' },
  { name: 'post.read', resource: 'post', action: 'read', description: 'Read posts' },
  { name: 'post.update', resource: 'post', action: 'update', description: 'Update posts' },
  { name: 'post.delete', resource: 'post', action: 'delete', description: 'Delete posts' },
  { name: 'post.publish', resource: 'post', action: 'publish', description: 'Publish posts' },
  { name: 'post.update.any', resource: 'post', action: 'update.any', description: 'Update any post' },
  { name: 'post.delete.any', resource: 'post', action: 'delete.any', description: 'Delete any post' },
  
  // File permissions
  { name: 'file.upload', resource: 'file', action: 'upload', description: 'Upload files' },
  { name: 'file.read', resource: 'file', action: 'read', description: 'Read files' },
  { name: 'file.read.any', resource: 'file', action: 'read.any', description: 'Read any file' },
  { name: 'file.delete', resource: 'file', action: 'delete', description: 'Delete own files' },
  { name: 'file.delete.any', resource: 'file', action: 'delete.any', description: 'Delete any file' },
  { name: 'file.download.any', resource: 'file', action: 'download.any', description: 'Download any file' },
  
  // User permissions
  { name: 'user.read', resource: 'user', action: 'read', description: 'Read user profiles' },
  { name: 'user.update', resource: 'user', action: 'update', description: 'Update own profile' },
  { name: 'user.update.any', resource: 'user', action: 'update.any', description: 'Update any user' },
  { name: 'user.delete.any', resource: 'user', action: 'delete.any', description: 'Delete any user' },
  { name: 'user.roles.manage', resource: 'user', action: 'roles.manage', description: 'Manage user roles' },
  
  // System permissions
  { name: 'system.settings.read', resource: 'system', action: 'settings.read', description: 'Read system settings' },
  { name: 'system.settings.update', resource: 'system', action: 'settings.update', description: 'Update system settings' },
  { name: 'system.audit.read', resource: 'system', action: 'audit.read', description: 'Read audit logs' },
  { name: 'system.analytics.read', resource: 'system', action: 'analytics.read', description: 'Read analytics' },
];

// Role permission mappings
const rolePermissions: Record<Role, string[]> = {
  [Role.ANONYMOUS]: ['post.read'],
  [Role.AUTHOR]: [
    'post.create',
    'post.read',
    'post.update',
    'post.delete',
    'post.publish',
    'file.upload',
    'file.read',
    'file.delete',
    'user.read',
    'user.update',
  ],
  [Role.ADMIN]: [
    'post.create',
    'post.read',
    'post.update',
    'post.delete',
    'post.publish',
    'post.update.any',
    'post.delete.any',
    'file.upload',
    'file.read',
    'file.read.any',
    'file.delete',
    'file.delete.any',
    'file.download.any',
    'user.read',
    'user.update',
    'user.update.any',
    'system.analytics.read',
    'system.audit.read',
  ],
  [Role.SUPER_ADMIN]: [
    'post.create',
    'post.read',
    'post.update',
    'post.delete',
    'post.publish',
    'post.update.any',
    'post.delete.any',
    'file.upload',
    'file.read',
    'file.read.any',
    'file.delete',
    'file.delete.any',
    'file.download.any',
    'user.read',
    'user.update',
    'user.update.any',
    'user.delete.any',
    'user.roles.manage',
    'system.settings.read',
    'system.settings.update',
    'system.audit.read',
    'system.analytics.read',
  ],
};

async function main() {
  console.log('🌱 Starting database seed...');

  // Create permissions
  console.log('Creating permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Create roles
  console.log('Creating roles...');
  const roles = await Promise.all(
    Object.values(Role).map(async (roleName) => {
      return prisma.roleDefinition.upsert({
        where: { name: roleName },
        update: {},
        create: {
          name: roleName,
          description: `${roleName.replace('_', ' ').toLowerCase()} role`,
        },
      });
    })
  );

  // Assign permissions to roles
  console.log('Assigning permissions to roles...');
  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = roles.find((r) => r.name === roleName);
    if (!role) continue;

    const rolePermissionData = await Promise.all(
      permissionNames.map(async (permissionName) => {
        const permission = await prisma.permission.findUnique({
          where: { name: permissionName },
        });
        if (!permission) return null;
        return { roleId: role.id, permissionId: permission.id };
      })
    );

    const validPermissions = rolePermissionData.filter((p) => p !== null) as {
      roleId: number;
      permissionId: number;
    }[];

    for (const perm of validPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: perm.roleId,
            permissionId: perm.permissionId,
          },
        },
        update: {},
        create: perm,
      });
    }
  }

  // Create default super admin user
  console.log('Creating default super admin user...');
  const hashedPassword = await bcrypt.hash('Admin@123!', 10);
  const superAdminRole = roles.find((r) => r.name === Role.SUPER_ADMIN);

  if (superAdminRole) {
    const superAdmin = await prisma.user.upsert({
      where: { email: 'admin@myeca.com' },
      update: {},
      create: {
        email: 'admin@myeca.com',
        username: 'admin',
        passwordHash: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        emailVerified: true,
        roles: {
          create: {
            roleId: superAdminRole.id,
          },
        },
      },
    });

    console.log('✅ Super admin created:', superAdmin.email);
  }

  // Create sample categories and tags
  console.log('Creating sample categories and tags...');
  const categories = [
    { name: 'Tax Planning', slug: 'tax-planning', description: 'Articles about tax planning strategies' },
    { name: 'Compliance', slug: 'compliance', description: 'Tax compliance and regulations' },
    { name: 'News', slug: 'news', description: 'Latest tax news and updates' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const tags = [
    { name: 'Income Tax', slug: 'income-tax' },
    { name: 'GST', slug: 'gst' },
    { name: 'TDS', slug: 'tds' },
    { name: 'Tax Saving', slug: 'tax-saving' },
    { name: 'ITR Filing', slug: 'itr-filing' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  // Create default site settings
  console.log('Creating default site settings...');
  const defaultSettings = [
    {
      key: 'site_name',
      value: { value: 'MyECA Admin Dashboard' },
      description: 'Site name',
    },
    {
      key: 'site_description',
      value: { value: 'Professional tax and compliance management platform' },
      description: 'Site description',
    },
    {
      key: 'maintenance_mode',
      value: { enabled: false },
      description: 'Maintenance mode toggle',
    },
    {
      key: 'allowed_file_types',
      value: { types: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'webp'] },
      description: 'Allowed file upload types',
    },
    {
      key: 'max_file_size',
      value: { size: 10485760 }, // 10MB in bytes
      description: 'Maximum file upload size in bytes',
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });