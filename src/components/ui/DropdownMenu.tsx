import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface DropdownItem {
  href: string;
  label: string;
  isActive?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
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

  // Memoized keyboard handler to prevent event listener cleanup issues
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    const menuItems = dropdownRef.current?.querySelectorAll('a') || [];
    const currentFocusIndex = Array.from(menuItems).findIndex(item => item === document.activeElement);

    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown': {
        event.preventDefault();
        if (currentFocusIndex === -1) {
          // No item focused, focus first item
          (menuItems[0] as HTMLElement)?.focus();
        } else {
          // Focus next item, wrap to first if at end
          const nextIndex = (currentFocusIndex + 1) % menuItems.length;
          (menuItems[nextIndex] as HTMLElement)?.focus();
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (currentFocusIndex === -1) {
          // No item focused, focus last item
          (menuItems[menuItems.length - 1] as HTMLElement)?.focus();
        } else {
          // Focus previous item, wrap to last if at beginning
          const prevIndex = currentFocusIndex === 0 ? menuItems.length - 1 : currentFocusIndex - 1;
          (menuItems[prevIndex] as HTMLElement)?.focus();
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        (menuItems[0] as HTMLElement)?.focus();
        break;
      }
      case 'End': {
        event.preventDefault();
        (menuItems[menuItems.length - 1] as HTMLElement)?.focus();
        break;
      }
    }
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  return (
    <div className="relative">
      <div ref={triggerRef}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-brand-neutral-200 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="solutions-menu"
        >
          <div className="py-1">
            {items.map((item, index) => {
              const linkClasses = `flex items-center px-4 py-2 text-sm transition-colors ${
                item.isActive 
                  ? 'text-brand-primary bg-brand-primary/10' 
                  : 'text-brand-neutral-700 hover:bg-brand-neutral-100 hover:text-brand-neutral-900'
              }`;

              // Handle onClick items (like Sign Out)
              if (item.onClick) {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.();
                      onClose();
                    }}
                    className={`${linkClasses} w-full text-left`}
                    role="menuitem"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.onClick?.();
                        onClose();
                      }
                    }}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </button>
                );
              }

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
                    {item.icon && <span className="mr-2">{item.icon}</span>}
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
                  {item.icon && <span className="mr-2">{item.icon}</span>}
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