import { useCallback } from 'react';

/**
 * Available downloadable files
 */
export const AVAILABLE_DOWNLOADS = {
  '7-habits-detailed': 'Detailed Breakdown - 7 Habits of Highly Effective People - Stephen Covey.txt',
  '7-habits-full-notes': 'Full Notes - 7 Habits of Highly Effective People - Stephen Covey.txt',
  '7-habits-quadrants': 'Quadrants Overview - 7 Habits of Highly Effective People - Stephen Covey.txt',
} as const;

export type DownloadKey = keyof typeof AVAILABLE_DOWNLOADS;

/**
 * Hook for triggering file downloads in a new tab that auto-closes
 * 
 * @returns Object with triggerDownload function
 * 
 * @example
 * ```tsx
 * const { triggerDownload } = useDownload();
 * 
 * return (
 *   <button onClick={() => triggerDownload('7-habits-detailed')}>
 *     Download Notes
 *   </button>
 * );
 * ```
 */
export function useDownload() {
  const triggerDownload = useCallback((fileKey: DownloadKey) => {
    const fileName = AVAILABLE_DOWNLOADS[fileKey];
    if (!fileName) {
      console.error(`Invalid download key: ${fileKey}`);
      return;
    }

    // Open the download bridge page in a new tab
    // The bridge page will start the download and auto-close
    const url = `/download?file=${encodeURIComponent(fileName)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return { triggerDownload };
}

/**
 * Direct function to trigger a download (for use outside React components)
 */
export function triggerDownload(fileKey: DownloadKey): void {
  const fileName = AVAILABLE_DOWNLOADS[fileKey];
  if (!fileName) {
    console.error(`Invalid download key: ${fileKey}`);
    return;
  }

  const url = `/download?file=${encodeURIComponent(fileName)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

