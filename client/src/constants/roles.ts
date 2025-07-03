import { UserRole } from '../types/auth';

export const USER_ROLES = {
  USER: 'user' as const,
  AUTHOR: 'author' as const,
  ADMIN: 'admin' as const,
  SUPER_ADMIN: 'super_admin' as const,
} as const;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  author: 2,
  admin: 3,
  super_admin: 4,
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: [
    'view_dashboard',
    'file_taxes',
    'view_documents',
    'use_calculators',
    'view_resources',
    'contact_support',
  ],
  [USER_ROLES.AUTHOR]: [
    'view_dashboard',
    'file_taxes',
    'view_documents',
    'use_calculators',
    'view_resources',
    'contact_support',
    'create_blog_posts',
    'edit_blog_posts',
    'publish_blog_posts',
  ],
  [USER_ROLES.ADMIN]: [
    'view_dashboard',
    'file_taxes',
    'view_documents',
    'use_calculators',
    'view_resources',
    'contact_support',
    'create_blog_posts',
    'edit_blog_posts',
    'publish_blog_posts',
    'manage_users',
    'view_admin_dashboard',
    'access_database_editor',
    'view_system_reports',
  ],
  [USER_ROLES.SUPER_ADMIN]: [
    'view_dashboard',
    'file_taxes',
    'view_documents',
    'use_calculators',
    'view_resources',
    'contact_support',
    'create_blog_posts',
    'edit_blog_posts',
    'publish_blog_posts',
    'manage_users',
    'view_admin_dashboard',
    'access_database_editor',
    'view_system_reports',
    'manage_system_settings',
    'access_all_features',
  ],
} as const;

export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

type Permission = (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS][number];

export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole].includes(permission);
};