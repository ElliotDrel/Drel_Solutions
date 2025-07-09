import * as React from "react";
import { Link, LinkProps, useLocation } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

interface TrackedLinkProps extends LinkProps {
  component?: 'desktop' | 'mobile' | 'dropdown';
  trackingLabel?: string;
}

const TrackedLink: React.FC<TrackedLinkProps> = React.memo(({ 
  to, 
  children, 
  component = 'desktop',
  trackingLabel,
  onClick,
  ...props 
}) => {
  const location = useLocation();
  const { trackNavigation, trackUserEngagement } = useAnalytics();

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    // Track navigation event
    trackNavigation({
      from: location.pathname,
      to: typeof to === 'string' ? to : to.pathname || '',
      method: 'click',
      component,
      timestamp: Date.now()
    });

    // Track user engagement
    if (trackingLabel) {
      trackUserEngagement('click', trackingLabel, {
        from_page: location.pathname,
        to_page: typeof to === 'string' ? to : to.pathname || '',
        component
      });
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(event);
    }
  }, [location.pathname, to, component, trackingLabel, trackNavigation, trackUserEngagement, onClick]);

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
});

TrackedLink.displayName = 'TrackedLink';

export default TrackedLink;