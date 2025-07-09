import * as React from "react";
import { Button } from "@/components/ui/button";
import TrackedLink from "./TrackedLink";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mobileMenuRef: React.RefObject<HTMLDivElement>;
}

const MobileMenu: React.FC<MobileMenuProps> = React.memo(({ isOpen, onClose, mobileMenuRef }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden" ref={mobileMenuRef}>
      <div 
        id="mobile-menu"
        className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors"
        role="menu"
        aria-labelledby="mobile-menu-button"
      >
        <TrackedLink to="/" className="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-colors" onClick={onClose} role="menuitem" component="mobile" trackingLabel="mobile_home">
          Home
        </TrackedLink>
        <TrackedLink to="/about" className="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-colors" onClick={onClose} role="menuitem" component="mobile" trackingLabel="mobile_about">
          About
        </TrackedLink>
        <TrackedLink to="/blog" className="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-colors" onClick={onClose} role="menuitem" component="mobile" trackingLabel="mobile_blog">
          Blog
        </TrackedLink>
        <TrackedLink to="/modeladvisor" className="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-colors" onClick={onClose} role="menuitem" component="mobile" trackingLabel="mobile_model_advisor">
          Model Advisor
        </TrackedLink>
        <div className="pt-2">
          <TrackedLink to="/contact" onClick={onClose} component="mobile" trackingLabel="mobile_contact_cta">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
              Let's Talk
            </Button>
          </TrackedLink>
        </div>
      </div>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;