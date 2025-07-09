import { Request, Response } from 'express';
import { db } from './db';
import fs from 'fs';
import path from 'path';
import os from 'os';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: HealthCheck;
    filesystem: HealthCheck;
    memory: HealthCheck;
    disk: HealthCheck;
    dependencies: HealthCheck;
  };
  system: {
    nodeVersion: string;
    platform: string;
    arch: string;
    memory: {
      total: number;
      free: number;
      used: number;
      usagePercent: number;
    };
    cpu: {
      loadAverage: number[];
      cores: number;
    };
  };
}

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  responseTime?: number;
  details?: any;
}

export class HealthChecker {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  async checkDatabase(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      // Test database connectivity
      await db.execute('SELECT 1 as test');
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        message: 'Database connection successful',
        responseTime,
        details: {
          type: 'postgresql',
          responseTime: `${responseTime}ms`
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          type: 'postgresql'
        }
      };
    }
  }

  async checkFilesystem(): Promise<HealthCheck> {
    const start = Date.now();
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');
      const testFile = path.join(uploadDir, '.healthcheck');
      
      // Check if uploads directory exists and is writable
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Test write access
      fs.writeFileSync(testFile, 'healthcheck');
      fs.unlinkSync(testFile);
      
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        message: 'Filesystem is accessible and writable',
        responseTime,
        details: {
          uploadsDir: uploadDir,
          responseTime: `${responseTime}ms`
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Filesystem access failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          uploadsDir: path.join(process.cwd(), 'uploads')
        }
      };
    }
  }

  checkMemory(): HealthCheck {
    try {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const usagePercent = (usedMem / totalMem) * 100;
      
      // Consider memory usage healthy if below 90%
      const status = usagePercent < 90 ? 'healthy' : usagePercent < 95 ? 'degraded' : 'unhealthy';
      
      return {
        status,
        message: `Memory usage: ${usagePercent.toFixed(2)}%`,
        details: {
          total: totalMem,
          free: freeMem,
          used: usedMem,
          usagePercent: usagePercent.toFixed(2)
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Memory check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  checkDisk(): HealthCheck {
    try {
      // This is a simplified disk check
      // In production, you might want to use a library like 'diskusage'
      const cwd = process.cwd();
      const stats = fs.statSync(cwd);
      
      return {
        status: 'healthy',
        message: 'Disk access is working',
        details: {
          workingDirectory: cwd,
          lastModified: stats.mtime.toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Disk access failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  checkDependencies(): HealthCheck {
    try {
      // Check if critical dependencies are available
      const criticalModules = [
        'express',
        'react',
        'react-dom',
        '@radix-ui/react-dialog',
        'drizzle-orm'
      ];
      
      const missingModules: string[] = [];
      
      for (const module of criticalModules) {
        try {
          require.resolve(module);
        } catch {
          missingModules.push(module);
        }
      }
      
      if (missingModules.length === 0) {
        return {
          status: 'healthy',
          message: 'All critical dependencies are available',
          details: {
            checkedModules: criticalModules
          }
        };
      } else {
        return {
          status: 'unhealthy',
          message: `Missing critical dependencies: ${missingModules.join(', ')}`,
          details: {
            missingModules,
            checkedModules: criticalModules
          }
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Dependency check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  getSystemInfo() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return {
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      memory: {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        usagePercent: ((usedMem / totalMem) * 100).toFixed(2)
      },
      cpu: {
        loadAverage: os.loadavg(),
        cores: os.cpus().length
      }
    };
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const [dbCheck, fsCheck, memoryCheck, diskCheck, depsCheck] = await Promise.all([
      this.checkDatabase(),
      this.checkFilesystem(),
      Promise.resolve(this.checkMemory()),
      Promise.resolve(this.checkDisk()),
      Promise.resolve(this.checkDependencies())
    ]);

    // Determine overall status
    const checks = [dbCheck, fsCheck, memoryCheck, diskCheck, depsCheck];
    const unhealthyCount = checks.filter(c => c.status === 'unhealthy').length;
    const degradedCount = checks.filter(c => c.status === 'degraded').length;

    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (unhealthyCount > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedCount > 0) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: dbCheck,
        filesystem: fsCheck,
        memory: memoryCheck,
        disk: diskCheck,
        dependencies: depsCheck
      },
      system: this.getSystemInfo()
    };
  }
}

// Create singleton instance
const healthChecker = new HealthChecker();

export const healthCheckHandler = async (req: Request, res: Response) => {
  try {
    const healthStatus = await healthChecker.getHealthStatus();
    
    // Set appropriate status code based on health
    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const simpleHealthCheck = (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}; 