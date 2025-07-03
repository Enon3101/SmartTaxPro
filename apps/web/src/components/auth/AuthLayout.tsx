import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">MyECA Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Professional tax and compliance management platform
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}