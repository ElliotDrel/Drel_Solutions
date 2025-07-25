import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User, LogOut, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import DropdownMenu from './ui/DropdownMenu';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseAvailable } from '@/integrations/supabase/client';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, available, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "px-3 py-2 text-sm font-medium transition-colors";
    return isActive(path) 
      ? `${baseClasses} text-brand-primary`
      : `${baseClasses} text-brand-neutral-700 hover:text-brand-primary`;
  };

  const getMobileLinkClassName = (path: string) => {
    const baseClasses = "block px-3 py-2 text-base font-medium";
    return isActive(path)
      ? `${baseClasses} text-brand-primary bg-brand-primary/10`
      : `${baseClasses} text-brand-neutral-700 hover:text-brand-primary`;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-bold text-brand-primary hover:text-brand-primary/80 transition-colors" data-testid="nav-logo">
              <img src="/drel-logo.png" alt="Drel Solutions Logo" className="h-10 w-10 rounded-lg" />
              <span>Drel Solutions</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={getLinkClassName('/')}>
                Home
              </Link>
              <Link to="/about" className={getLinkClassName('/about')} data-testid="nav-about">
                About
              </Link>
              <Link to="/blog" className={getLinkClassName('/blog')} data-testid="nav-blog">
                Blog
              </Link>
              <DropdownMenu
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                onClose={() => setIsDropdownOpen(false)}
                trigger={
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className={`${getLinkClassName('/modeladvisor')} flex items-center`}
                    data-testid="nav-modeladvisor"
                  >
                    Solutions <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                }
                items={[
                  { href: '/modeladvisor', label: 'Model Advisor', isActive: isActive('/modeladvisor') }
                ]}
              />
              
              {/* AI Fundamentals Survey Link - show if available and user not authenticated */}
              {isSupabaseAvailable() && !user && (
                <Link 
                  to="/ai-fundamentals" 
                  className={getLinkClassName('/ai-fundamentals')}
                  data-testid="nav-ai-fundamentals"
                >
                  <BookOpen className="mr-1 h-4 w-4" />
                  AI Fundamentals
                </Link>
              )}
              
              {/* User Menu or Auth Links */}
              {user ? (
                <DropdownMenu
                  isOpen={isUserMenuOpen}
                  onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onClose={() => setIsUserMenuOpen(false)}
                  trigger={
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                      className="px-3 py-2 text-sm font-medium transition-colors text-brand-neutral-700 hover:text-brand-primary flex items-center"
                      data-testid="nav-user-menu"
                    >
                      <User className="mr-1 h-4 w-4" />
                      Account <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  }
                  items={[
                    { 
                      href: '/ai-fundamentals', 
                      label: 'My Progress', 
                      isActive: isActive('/ai-fundamentals'),
                      icon: <BookOpen className="w-4 h-4" />
                    },
                    { 
                      label: 'Sign Out', 
                      isActive: false,
                      icon: <LogOut className="w-4 h-4" />,
                      onClick: handleSignOut
                    }
                  ]}
                />
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/signin" className="px-3 py-2 text-sm font-medium transition-colors text-brand-neutral-700 hover:text-brand-primary" data-testid="nav-signin">
                    Sign In
                  </Link>
                  <Link to="/contact" data-testid="nav-contact">
                    <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2">Let's Talk</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-brand-neutral-700 hover:text-brand-primary p-2"
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          links={[
            { href: '/', label: 'Home', className: getMobileLinkClassName('/') },
            { href: '/about', label: 'About', className: getMobileLinkClassName('/about') },
            { href: '/blog', label: 'Blog', className: getMobileLinkClassName('/blog') },
            { href: '/modeladvisor', label: 'Model Advisor', className: getMobileLinkClassName('/modeladvisor') },
            ...(isSupabaseAvailable() ? [{ 
              href: '/ai-fundamentals', 
              label: user ? 'My Progress' : 'AI Fundamentals', 
              className: getMobileLinkClassName('/ai-fundamentals') 
            }] : []),
            ...(user ? [
              { label: 'Sign Out', className: 'block px-3 py-2 text-base font-medium text-brand-danger hover:bg-brand-danger/10', onClick: handleSignOut }
            ] : [
              { href: '/signin', label: 'Sign In', className: getMobileLinkClassName('/signin') }
            ])
          ]}
        />
      </div>
    </nav>
  );
};

export default Navigation; 