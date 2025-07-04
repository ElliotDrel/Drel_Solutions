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
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={
                    linkClasses("/modeladvisor", "flex items-center")
                  }
                >
                  Solutions <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <Link
                      to="/modeladvisor"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
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
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link to="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/about" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <a
                href="https://drelsolutions.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
              >
                Blog
              </a>
              <Link to="/modeladvisor" className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
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