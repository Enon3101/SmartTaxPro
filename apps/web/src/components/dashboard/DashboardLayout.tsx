import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import {
  LayoutDashboard,
  FileText,
  FileImage,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiredRole?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Posts',
    href: '/posts',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: 'Files',
    href: '/files',
    icon: <FileImage className="h-5 w-5" />,
    requiredRole: 'ADMIN',
  },
  {
    label: 'Users',
    href: '/users',
    icon: <Users className="h-5 w-5" />,
    requiredRole: 'SUPER_ADMIN',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    requiredRole: 'SUPER_ADMIN',
  },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRole) return true;
    return hasRole(item.requiredRole);
  });
  
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <h2 className="text-xl font-semibold">MyECA Admin</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* User section */}
          <div className="border-t p-4">
            <Link
              to="/profile"
              className="sidebar-item"
              onClick={() => setSidebarOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="sidebar-item w-full text-left mt-1"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex-1" />
          
          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
            >
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {user?.firstName?.[0] || user?.email[0].toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm">
                {user?.firstName} {user?.lastName}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card shadow-lg z-20">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-muted-foreground capitalize">
                        {user?.roles[0]?.role.name.replace('_', ' ')}
                      </p>
                    </div>
                    <hr className="my-2" />
                    <Link
                      to="/profile"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}