# Railway Deployment Troubleshooting Guide

## Healthcheck Failed Issues

### Common Causes and Solutions

#### 1. Server Not Starting
**Symptoms:** Healthcheck fails with "service unavailable"
**Solutions:**
- Check Railway logs for startup errors
- Verify `dist/index.js` exists after build
- Ensure all environment variables are set
- Check database connectivity

#### 2. Port Configuration Issues
**Symptoms:** Server starts but healthcheck can't connect
**Solutions:**
- Verify `PORT` environment variable is set by Railway
- Ensure server binds to `0.0.0.0` not `localhost`
- Check if port is already in use

#### 3. Database Connection Issues
**Symptoms:** Server starts but database healthcheck fails
**Solutions:**
- Verify `DATABASE_URL` is correctly set in Railway
- Check database is accessible from Railway's network
- Ensure database credentials are correct

#### 4. Memory/Resource Issues
**Symptoms:** Server starts but crashes under load
**Solutions:**
- Check memory usage in Railway logs
- Optimize bundle size
- Consider upgrading Railway plan

## Debugging Steps

### 1. Check Railway Logs
```bash
# View real-time logs
railway logs

# View specific service logs
railway logs --service your-service-name
```

### 2. Test Healthcheck Endpoints Locally
```bash
# Start server locally
npm run dev

# Test endpoints
curl http://localhost:5000/ready
curl http://localhost:5000/health/simple
curl http://localhost:5000/health
```

### 3. Verify Build Output
```bash
# Build locally
npm run build

# Check if dist/index.js exists
ls -la dist/

# Test production build locally
NODE_ENV=production node dist/index.js
```

### 4. Check Environment Variables
```bash
# List all environment variables in Railway
railway variables

# Set missing variables
railway variables set DATABASE_URL=your-database-url
railway variables set NODE_ENV=production
```

## Configuration Files

### railway.toml
```toml
[build]
builder = "nixpacks"

[build.environment]
NODE_ENV = "production"
NPM_CONFIG_OPTIONAL = "false"
NPM_CONFIG_OMIT = "optional"
NPM_CONFIG_LEGACY_PEER_DEPS = "true"
NPM_CONFIG_IGNORE_SCRIPTS = "false"
NPM_CONFIG_IGNORE_ENGINES = "true"

[deploy]
startCommand = "chmod +x start.sh && ./start.sh"
healthcheckPath = "/ready"
healthcheckTimeout = 30
restartPolicyType = "always"
numReplicas = 1
```

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to "production"
- `PORT`: Automatically set by Railway

## Healthcheck Endpoints

### `/ready` (Simple Readiness Check)
- **Purpose:** Basic server readiness
- **Response:** 200 OK if server is running
- **Use:** Railway healthcheck

### `/health/simple` (Simple Health Check)
- **Purpose:** Basic health status
- **Response:** 200 OK with basic info
- **Use:** Load balancer healthchecks

### `/health` (Comprehensive Health Check)
- **Purpose:** Detailed system health
- **Response:** 200 OK with detailed status
- **Use:** Monitoring and debugging

## Common Error Messages

### "Cannot find module"
- **Cause:** Missing dependencies or build issues
- **Solution:** Check `package.json` and rebuild

### "EADDRINUSE"
- **Cause:** Port already in use
- **Solution:** Railway handles this automatically

### "Database connection failed"
- **Cause:** Invalid DATABASE_URL or network issues
- **Solution:** Verify database configuration

### "Health check timeout"
- **Cause:** Server taking too long to respond
- **Solution:** Optimize startup time or increase timeout

## Performance Optimization

### 1. Reduce Bundle Size
- Use tree shaking
- Remove unused dependencies
- Optimize images and assets

### 2. Optimize Startup Time
- Lazy load non-critical modules
- Use connection pooling for database
- Minimize synchronous operations

### 3. Memory Management
- Monitor memory usage
- Implement proper garbage collection
- Use streaming for large files

## Monitoring and Alerts

### Railway Metrics
- CPU usage
- Memory usage
- Network I/O
- Response times

### Custom Monitoring
- Health check endpoints
- Application logs
- Error tracking (Sentry)

## Emergency Procedures

### 1. Rollback Deployment
```bash
# Rollback to previous version
railway rollback
```

### 2. Restart Service
```bash
# Restart the service
railway service restart
```

### 3. Check Service Status
```bash
# View service status
railway status
```

## Support Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status Page](https://status.railway.app/)

## Contact Information

For urgent issues:
1. Check Railway status page
2. Review this troubleshooting guide
3. Check application logs
4. Contact Railway support if needed 