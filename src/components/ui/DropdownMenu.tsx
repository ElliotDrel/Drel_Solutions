import * as React from "react";
import TrackedLink from "./TrackedLink";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  linkClasses: (path: string, additional?: string) => string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = React.memo(({ isOpen, onClose, linkClasses }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="solutions-dropdown"
      className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-50 transition-colors"
      role="menu"
      aria-labelledby="solutions-button"
    >
      <TrackedLink
        to="/modeladvisor"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        onClick={onClose}
        role="menuitem"
        component="dropdown"
        trackingLabel="dropdown_model_advisor"
      >
        Model Advisor
      </TrackedLink>
    </div>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;