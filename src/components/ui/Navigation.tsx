import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Centralized site navigation bar.
 *
 * Replaces the duplicated in-page `Navigation` components previously
 * declared inside individual page files.  The component handles both
 * desktop and mobile layouts as well as the Solutions dropdown.  Active
 * links are automatically styled based on the current route.
 */
const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const location = useLocation();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

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

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        }
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen, isMenuOpen]);

  // Handle clicks outside dropdown and mobile menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Helper to style active links */
  const linkClasses = (
    path: string,
    additional?: string
  ) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      location.pathname === path
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    } ${additional ?? ""}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <img
                src="/drel-logo.png"
                alt="Drel Solutions Logo"
                className="h-10 w-10 rounded-lg"
              />
              <span className="ml-1">Drel Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={linkClasses("/")}>Home</Link>
              <Link to="/about" className={linkClasses("/about")}>About</Link>
              {/* External blog link */}
              <a
                href="https://drelsolutions.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Blog
              </a>

              {/* Solutions dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                  <div 
                    id="solutions-dropdown"
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                    role="menu"
                    aria-labelledby="solutions-button"
                  >
                    <Link
                      to="/modeladvisor"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                    >
                      Model Advisor
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  Let's Talk
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div 
              id="mobile-menu"
              className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200"
              role="menu"
              aria-labelledby="mobile-menu-button"
            >
              <Link to="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)} role="menuitem">
                Home
              </Link>
              <Link to="/about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)} role="menuitem">
                About
              </Link>
              <a
                href="https://drelsolutions.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                role="menuitem"
              >
                Blog
              </a>
              <Link to="/modeladvisor" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)} role="menuitem">
                Model Advisor
              </Link>
              <div className="pt-2">
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Let's Talk
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;