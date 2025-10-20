# Download System

This directory contains the implementation of the auto-downloading file system for Drel Solutions.

## How It Works

The system uses a "bridge page" pattern that:
1. Opens in a new tab when the user clicks a download button
2. Automatically triggers the file download
3. Attempts to close itself after the download starts
4. Shows a fallback UI if the browser blocks auto-close

## File Structure

```
src/
├── pages/
│   └── Download.tsx          # Bridge page that handles the download
├── hooks/
│   └── use-download.ts       # Hook and utilities for triggering downloads
└── components/
    ├── DownloadButton.tsx    # Reusable button component
    └── DownloadDemo.tsx      # Example implementation
```

## Usage

### Basic Usage with DownloadButton Component

```tsx
import { DownloadButton } from '@/components/DownloadButton';

export function MyComponent() {
  return (
    <DownloadButton fileKey="7-habits-detailed">
      Download Detailed Breakdown
    </DownloadButton>
  );
}
```

### Custom Implementation with useDownload Hook

```tsx
import { useDownload } from '@/hooks/use-download';

export function MyCustomButton() {
  const { triggerDownload } = useDownload();

  return (
    <button onClick={() => triggerDownload('7-habits-full-notes')}>
      Get Full Notes
    </button>
  );
}
```

### Outside React Components

```tsx
import { triggerDownload } from '@/hooks/use-download';

// In event handlers, callbacks, etc.
function handleSomeAction() {
  triggerDownload('7-habits-quadrants');
}
```

## Available Files

The available downloads are defined in `use-download.ts`:

- `'7-habits-detailed'` - Detailed Breakdown
- `'7-habits-full-notes'` - Full Notes  
- `'7-habits-quadrants'` - Time Management Quadrants

## Adding New Files

1. Place the file in `public/downloads/`
2. Add it to the `AVAILABLE_DOWNLOADS` object in `use-download.ts`:

```ts
export const AVAILABLE_DOWNLOADS = {
  // existing files...
  'my-new-file': 'My New File.txt',
} as const;
```

3. Use the new key in your components:

```tsx
<DownloadButton fileKey="my-new-file">
  Download My File
</DownloadButton>
```

## Browser Compatibility

- **Auto-close**: Works in all modern browsers when the window is opened via `window.open()`
- **Fallback**: If auto-close is blocked, users see a "Close Tab" button
- **Download**: Standard HTML5 download attribute support

## Notes

- Files are served statically from `public/downloads/`
- The bridge page route is `/download?file=filename.txt`
- Window must be opened by script (via `window.open()`) for auto-close to work
- A small delay (700ms) ensures the download starts before closing

