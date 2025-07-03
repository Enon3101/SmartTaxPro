// Utility functions for role-based access
export const isAdmin = (role: string) => role === 'admin' || role === 'super_admin';
export const isSuperAdmin = (role: string) => role === 'super_admin';
export const isAuthor = (role: string) => role === 'author';
export const isUser = (role: string) => role === 'user';
// Add more as needed 
