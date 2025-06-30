# SmartTaxPro

A comprehensive tax filing and management platform built with modern web technologies. SmartTaxPro provides a complete solution for income tax filing, calculations, and document management.

## 🚀 Features

- **Tax Filing**: Complete ITR (Income Tax Return) filing support
- **Tax Calculators**: Multiple calculators for income tax, GST, TDS, and more
- **Document Management**: Secure document upload and storage
- **User Dashboard**: Personalized dashboard with filing history
- **Admin Panel**: Complete admin interface for user management
- **Multi-language Support**: English and Hindi support
- **Responsive Design**: Mobile-first design for all devices
- **Real-time Updates**: Live tax calculations and form validation

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom components
- **State Management**: React Query + Context API
- **Forms**: React Hook Form with validation
- **UI Components**: Custom component library with shadcn/ui
- **Rich Text Editor**: Tiptap
- **Charts**: Recharts for data visualization

### Backend
- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with Neon (serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Google OAuth + JWT
- **File Storage**: Local file system with cloud-ready architecture
- **API**: RESTful API with Express.js

### DevOps & Tools
- **Database Migrations**: Drizzle migrations
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Containerization**: Docker support
- **CI/CD**: GitHub Actions ready

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (local or cloud)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Enon3101/SmartTaxPro.git
cd SmartTaxPro
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE smarttaxpro;
   ```

#### Option B: Neon (Cloud PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smarttaxpro"

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT Secret
JWT_SECRET="your-jwt-secret-key"

# Server Configuration
PORT=3001
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 5. Database Migrations

Run the database migrations to set up the schema:

```bash
# Run migrations
npm run db:migrate

# (Optional) Seed initial data
npm run db:seed
```

### 6. Start Development Servers

```bash
# Start backend server (from root directory)
npm run dev:server

# Start frontend (in a new terminal, from root directory)
npm run dev:client
```

### 7. Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```
SmartTaxPro/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components (shadcn/ui)
│   │   │   └── ...            # Custom components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utility functions
│   │   ├── data/              # Static data and configurations
│   │   └── utils/             # Helper utilities
│   └── package.json
├── server/                     # Backend Node.js application
│   ├── services/              # Business logic services
│   ├── routes/                # API route handlers
│   ├── middleware/            # Express middleware
│   └── index.ts               # Server entry point
├── shared/                     # Shared code between frontend/backend
│   └── schema.ts              # Database schema definitions
├── migrations/                 # Database migration files
├── scripts/                    # Utility scripts
├── uploads/                    # File upload directory
└── docs/                       # Documentation
```

## 🧪 Available Scripts

### Root Directory
```bash
npm run dev:server          # Start backend development server
npm run dev:client          # Start frontend development server
npm run dev                 # Start both servers concurrently
npm run build               # Build both frontend and backend
npm run test                # Run all tests
npm run lint                # Run ESLint
npm run format              # Run Prettier
npm run db:migrate          # Run database migrations
npm run db:seed             # Seed database with initial data
```

### Client Directory
```bash
cd client
npm run dev                 # Start Vite dev server
npm run build               # Build for production
npm run preview             # Preview production build
npm run test                # Run frontend tests
```

## 🔧 Configuration

### Database Configuration
The application uses Drizzle ORM with PostgreSQL. Database configuration is handled through:
- `drizzle.config.ts` - Drizzle configuration
- `shared/schema.ts` - Database schema definitions
- Environment variables for connection

### Authentication
- Google OAuth for user authentication
- JWT tokens for session management
- Protected routes with role-based access

### File Management
- Local file storage with cloud-ready architecture
- Support for multiple file types
- Secure file upload with validation

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations
4. Start the production server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `docs/` folder
- Review the troubleshooting guide

## 🔄 Changelog

See [CHANGELOG_v2.1.md](CHANGELOG_v2.1.md) for detailed version history and updates.
