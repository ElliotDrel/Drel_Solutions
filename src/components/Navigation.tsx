import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import DropdownMenu from './ui/DropdownMenu';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "px-3 py-2 text-sm font-medium transition-colors";
    return isActive(path) 
      ? `${baseClasses} text-blue-600`
      : `${baseClasses} text-gray-700 hover:text-blue-600`;
  };

  const getMobileLinkClassName = (path: string) => {
    const baseClasses = "block px-3 py-2 text-base font-medium";
    return isActive(path)
      ? `${baseClasses} text-blue-600 bg-blue-50`
      : `${baseClasses} text-gray-700 hover:text-blue-600`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
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
              <Link to="/about" className={getLinkClassName('/about')}>
                About
              </Link>
              <a 
                href="https://drelsolutions.substack.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Blog
              </a>
              <DropdownMenu
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                onClose={() => setIsDropdownOpen(false)}
                trigger={
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className={`${getLinkClassName('/modeladvisor')} flex items-center`}
                  >
                    Solutions <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                }
                items={[
                  { href: '/modeladvisor', label: 'Model Advisor', isActive: isActive('/modeladvisor') }
                ]}
              />
              <ThemeToggle />
              <Link to="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Let's Talk</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-700 hover:text-blue-600 p-2"
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
            { href: 'https://drelsolutions.substack.com/', label: 'Blog', external: true, className: "block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium" },
            { href: '/modeladvisor', label: 'Model Advisor', className: getMobileLinkClassName('/modeladvisor') }
          ]}
        />
      </div>
    </nav>
  );
};

export default Navigation; 