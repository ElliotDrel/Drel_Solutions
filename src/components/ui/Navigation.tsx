import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import TrackedLink from "./TrackedLink";
import ThemeToggle from "./ThemeToggle";

// Lazy load heavy components
const LazyDropdownMenu = React.lazy(() => import('./DropdownMenu'));
const LazyMobileMenu = React.lazy(() => import('./MobileMenu'));

// Fallback component for lazy loading
const LoadingSpinner = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-20"></div>
  </div>
);

/**
 * Centralized site navigation bar.
 *
 * Replaces the duplicated in-page `Navigation` components previously
 * declared inside individual page files.  The component handles both
 * desktop and mobile layouts as well as the Solutions dropdown.  Active
 * links are automatically styled based on the current route.
 */
const Navigation: React.FC = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const location = useLocation();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const { trackNavigation, trackDropdownInteraction, trackMobileMenuInteraction, trackUserEngagement } = useAnalytics();

  // Handle body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Memoized event handlers for better performance
  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (isDropdownOpen) {
        closeDropdown('keyboard');
      }
      if (isMenuOpen) {
        closeMobileMenu('keyboard');
      }
    }
  }, [isDropdownOpen, isMenuOpen, closeDropdown, closeMobileMenu]);

  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      closeDropdown('outside_click');
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
      closeMobileMenu('outside_click');
    }
  }, [closeDropdown, closeMobileMenu]);

  const toggleMobileMenu = React.useCallback(() => {
    setIsMenuOpen(prev => {
      const newState = !prev;
      trackMobileMenuInteraction(newState ? 'open' : 'close', 'click');
      return newState;
    });
  }, [trackMobileMenuInteraction]);

  const toggleDropdown = React.useCallback(() => {
    setIsDropdownOpen(prev => {
      const newState = !prev;
      trackDropdownInteraction(newState ? 'open' : 'close', 'click');
      return newState;
    });
  }, [trackDropdownInteraction]);

  const closeMobileMenu = React.useCallback((method: 'click' | 'keyboard' | 'outside_click' = 'click') => {
    setIsMenuOpen(false);
    trackMobileMenuInteraction('close', method);
  }, [trackMobileMenuInteraction]);

  const closeDropdown = React.useCallback((method: 'click' | 'keyboard' | 'outside_click' = 'click') => {
    setIsDropdownOpen(false);
    trackDropdownInteraction('close', method);
  }, [trackDropdownInteraction]);

  // Handle keyboard navigation
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle clicks outside dropdown and mobile menu
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  /* Helper to style active links - memoized for performance with dark mode support */
  const linkClasses = React.useCallback((
    path: string,
    additional?: string
  ) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      location.pathname === path
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
    } ${additional ?? ""}`, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <TrackedLink
              to="/"
              className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              component="desktop"
              trackingLabel="logo"
            >
              <img
                src="/drel-logo.png"
                alt="Drel Solutions Logo"
                className="h-10 w-10 rounded-lg"
              />
              <span className="ml-1">Drel Solutions</span>
            </TrackedLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <TrackedLink to="/" className={linkClasses("/")} component="desktop" trackingLabel="nav_home">
                Home
              </TrackedLink>
              <TrackedLink to="/about" className={linkClasses("/about")} component="desktop" trackingLabel="nav_about">
                About
              </TrackedLink>
              <TrackedLink to="/blog" className={linkClasses("/blog")} component="desktop" trackingLabel="nav_blog">
                Blog
              </TrackedLink>

              {/* Solutions dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="solutions-button"
                  onClick={toggleDropdown}
                  className={
                    linkClasses("/modeladvisor", "flex items-center")
                  }
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-controls="solutions-dropdown"
                >
                  Solutions <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <LazyDropdownMenu 
                      isOpen={isDropdownOpen}
                      onClose={closeDropdown}
                      linkClasses={linkClasses}
                    />
                  </React.Suspense>
                )}
              </div>

              <ThemeToggle />
              
              <TrackedLink to="/contact" component="desktop" trackingLabel="nav_contact_cta">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2">
                  Let's Talk
                </Button>
              </TrackedLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 p-2 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                data-testid="mobile-menu-button"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <React.Suspense fallback={<LoadingSpinner />}>
            <LazyMobileMenu 
              isOpen={isMenuOpen}
              onClose={closeMobileMenu}
              mobileMenuRef={mobileMenuRef}
            />
          </React.Suspense>
        )}
      </div>
    </nav>
  );
});

// Display name for better debugging
Navigation.displayName = 'Navigation';

export default Navigation;