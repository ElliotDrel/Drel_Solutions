import { Button } from '@/components/ui/button';
import { useDownload, type DownloadKey } from '@/hooks/use-download';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  fileKey: DownloadKey;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
}

/**
 * Button component that triggers a file download in a new tab
 * 
 * @example
 * ```tsx
 * <DownloadButton fileKey="7-habits-detailed">
 *   Download Detailed Breakdown
 * </DownloadButton>
 * 
 * <DownloadButton 
 *   fileKey="7-habits-full-notes"
 *   variant="outline"
 *   showIcon
 * >
 *   Full Notes
 * </DownloadButton>
 * ```
 */
export function DownloadButton({
  fileKey,
  children,
  variant = 'default',
  size = 'default',
  className,
  showIcon = true,
}: DownloadButtonProps) {
  const { triggerDownload } = useDownload();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => triggerDownload(fileKey)}
    >
      {showIcon && <Download className="mr-2 h-4 w-4" />}
      {children || 'Download'}
    </Button>
  );
}

