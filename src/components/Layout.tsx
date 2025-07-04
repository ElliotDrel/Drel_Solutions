import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/ui/Navigation';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 