import React from 'react';
import { Link } from 'react-router-dom';

interface TrackedLinkProps {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  external?: boolean;
  trackingEvent?: string;
  trackingCategory?: string;
  trackingLabel?: string;
}

const TrackedLink: React.FC<TrackedLinkProps> = ({
  to,
  href,
  children,
  className,
  onClick,
  external = false,
  trackingEvent = 'click',
  trackingCategory = 'navigation',
  trackingLabel
}) => {
  const handleClick = () => {
    // Track the click event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', trackingEvent, {
        event_category: trackingCategory,
        event_label: trackingLabel || (to || href),
        transport_type: 'beacon'
      });
    }

    // For Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va('track', trackingEvent, {
        category: trackingCategory,
        label: trackingLabel || (to || href)
      });
    }

    // Call the provided onClick handler
    if (onClick) {
      onClick();
    }
  };

  // External link
  if (external || href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  // Internal link using React Router
  if (to) {
    return (
      <Link
        to={to}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  }

  // Fallback to button behavior
  return (
    <button
      className={className}
      onClick={handleClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default TrackedLink; 