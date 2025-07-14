import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface MobileLink {
  href: string;
  label: string;
  className: string;
  external?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: MobileLink[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  links
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border">
        {links.map((link, index) => {
          if (link.external) {
            return (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={link.className}
                onClick={onClose}
              >
                {link.label}
              </a>
            );
          }

          return (
            <Link
              key={index}
              to={link.href}
              className={link.className}
              onClick={onClose}
            >
              {link.label}
            </Link>
          );
        })}
        
        <div className="pt-2">
          <Link to="/contact" onClick={onClose}>
            <Button className="w-full bg-primary hover:bg-primary-hover text-background">
              Let's Talk
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 