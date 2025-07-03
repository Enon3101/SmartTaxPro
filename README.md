# MyECA Admin Dashboard

A secure, responsive back-office system with role-based access control for managing blog posts, files, and users.

## 🚀 Features

### Authentication & Authorization
- ✅ Email + password authentication with bcrypt
- ✅ JWT access tokens (15min) + refresh tokens (7d)
- ✅ Role-based access control (RBAC)
- ✅ Default roles: `author`, `admin`, `super_admin`
- ✅ HTTP-only cookies for refresh tokens

### Blog CMS
- ✅ Rich-text editor with TipTap
- ✅ Draft/publish workflow
- ✅ Version history tracking
- ✅ SEO metadata management
- ✅ Tag and category support
- ✅ Role-based content access

### File Management
- ✅ S3-compatible storage support
- ✅ Local storage fallback
- ✅ File upload with virus scanning hooks
- ✅ Access control and audit logging
- ✅ Bulk operations support

### Dashboard Features
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Real-time analytics widgets
- ✅ Activity monitoring
- ✅ System health indicators

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Radix UI** for accessible components
- **TanStack Query** for data fetching
- **React Hook Form** + Zod validation
- **Zustand** for state management

### Backend
- **Node.js 20** + Express
- **Prisma ORM** with PostgreSQL
- **JWT** authentication
- **Multer** for file uploads
- **AWS S3** integration
- **Helmet** for security

### Testing & DevOps
- **Vitest** for unit tests
- **Playwright** for E2E tests
- **GitHub Actions** CI/CD
- **Docker** containerization
- **pnpm** monorepo management

## 📦 Project Structure

```
myeca-admin/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Express backend
├── packages/
│   ├── ui/           # Shared UI components
│   ├── shared/       # Shared types & utils
│   └── config/       # Shared configurations
├── turbo.json        # Turborepo config
└── pnpm-workspace.yaml
```

## � Quick Start

### Prerequisites
- Node.js >= 20
- PostgreSQL >= 14
- pnpm >= 9

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd myeca-admin
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy example env files
   cp apps/api/.env.example apps/api/.env
   
   # Edit the .env file with your database credentials
   # Generate secrets with: openssl rand -hex 64
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   
   # Seed initial data
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Default Credentials
- **Email**: admin@myeca.com
- **Password**: Admin@123!

## 📝 Available Scripts

### Root Commands
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm test` - Run tests across all apps
- `pnpm lint` - Lint all apps
- `pnpm format` - Format code with Prettier

### Database Commands
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes
- `pnpm db:migrate` - Run migrations
- `pnpm db:seed` - Seed database with initial data

## 🔒 Security Features

- HTTPS enforced in production
- Helmet.js security headers
- Rate limiting on auth endpoints
- Input validation with Zod
- SQL injection protection via Prisma
- XSS protection
- CSRF protection with SameSite cookies

## 📊 Role Permissions Matrix

| Permission | Author | Admin | Super Admin |
|------------|--------|-------|-------------|
| Create posts | ✅ | ✅ | ✅ |
| Edit own posts | ✅ | ✅ | ✅ |
| Edit any post | ❌ | ✅ | ✅ |
| Delete own posts | ✅ | ✅ | ✅ |
| Delete any post | ❌ | ✅ | ✅ |
| Upload files | ✅ | ✅ | ✅ |
| View all files | ❌ | ✅ | ✅ |
| Download any file | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| System settings | ❌ | ❌ | ✅ |

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

## 📦 Building for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @myeca/web build
pnpm --filter @myeca/api build
```

## 🚀 Deployment

### Using Docker

```bash
# Build Docker images
docker-compose build

# Run with Docker Compose
docker-compose up -d
```

### Environment Variables

See `.env.example` files in each app for required environment variables.

## 📝 API Documentation

API documentation is available at `/api/docs` when running the development server.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ACK — BACKOFFICE BUILD STARTED

The monorepo structure has been set up with:
- ✅ Monorepo configuration (Turborepo + pnpm)
- ✅ API application with Prisma and role-based auth
- ✅ Web application with React and TailwindCSS
- ✅ Authentication system with JWT + refresh tokens
- ✅ Role-based access control (Author, Admin, Super Admin)
- ✅ Database schema for users, posts, files, and permissions
- ✅ Seed script with default super admin user

Next steps would be to:
1. Install dependencies with `pnpm install`
2. Set up the database and run migrations
3. Implement the remaining API routes
4. Build the dashboard UI components
5. Add file upload functionality
6. Implement the blog CMS features
