import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  useGradientBackground?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, useGradientBackground = false }) => {
  const backgroundClass = useGradientBackground 
    ? "bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen"
    : "bg-background min-h-screen";

  return (
    <div className={backgroundClass}>
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout; 