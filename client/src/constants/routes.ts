// Public routes (no authentication required)
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRICING: '/pricing',
  NOT_FOUND: '/404',
} as const;

// Protected routes (authentication required)
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  TAX_FILING: '/tax-filing',
  START_FILING: '/tax-filing/start',
  QUICK_FILING: '/tax-filing/quick',
  MY_FILINGS: '/tax-filing/my-filings',
  DOCUMENT_VAULT: '/documents',
  CALCULATORS: '/calculators',
  TAX_RESOURCES: '/tax-resources',
  SUPPORT: '/support',
  TAX_EXPERT: '/support/tax-expert',
  PAYMENT: '/payment',
} as const;

// Admin routes (admin role required)
export const ADMIN_ROUTES = {
  ADMIN_DASHBOARD: '/admin',
  USER_MANAGEMENT: '/admin/users',
  DATABASE_EDITOR: '/admin/database',
  BLOG_ADMIN: '/admin/blog',
} as const;

// Author routes (author role required)
export const AUTHOR_ROUTES = {
  BLOG_ADMIN: '/blog-admin',
} as const;

// All routes combined
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
  ...ADMIN_ROUTES,
  ...AUTHOR_ROUTES,
} as const;