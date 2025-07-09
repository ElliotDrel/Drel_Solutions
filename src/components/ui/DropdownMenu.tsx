import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface DropdownItem {
  href: string;
  label: string;
  isActive?: boolean;
  external?: boolean;
}

interface DropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  trigger: React.ReactNode;
  items: DropdownItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onToggle,
  onClose,
  trigger,
  items
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown': {
          event.preventDefault();
          // Focus first item
          const firstItem = dropdownRef.current?.querySelector('a');
          firstItem?.focus();
          break;
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative">
      <div ref={triggerRef}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="solutions-menu"
        >
          <div className="py-1">
            {items.map((item, index) => {
              const linkClasses = `block px-4 py-2 text-sm transition-colors ${
                item.isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`;

              if (item.external) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                    role="menuitem"
                    onClick={onClose}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClose();
                        window.open(item.href, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={index}
                  to={item.href}
                  className={linkClasses}
                  role="menuitem"
                  onClick={onClose}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onClose();
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu; 