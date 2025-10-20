import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * Download Bridge Page
 * 
 * This page is opened in a new tab, triggers a file download,
 * and then attempts to close itself automatically.
 * 
 * Usage: /download?file=filename.txt
 */
export default function Download() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileName = searchParams.get('file');

  useEffect(() => {
    if (!fileName) {
      // If no file specified, redirect to home
      navigate('/');
      return;
    }

    // Create an invisible link to the static file and click it
    const a = document.createElement('a');
    a.href = `/downloads/${fileName}`;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Give the browser a moment to start the download, then try to close the tab
    const tryClose = () => {
      // Some browsers need two attempts; both are no-ops if not allowed
      window.close();
      setTimeout(() => window.close(), 150);
    };

    const timer = setTimeout(tryClose, 700);
    return () => clearTimeout(timer);
  }, [fileName, navigate]);

  // Fallback UI in case the browser blocks auto-close
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-primary-600 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Downloading...
        </h1>
        <p className="text-gray-600 mb-6">
          Your download should begin automatically. This tab will close momentarily.
        </p>
        <button
          onClick={() => window.close()}
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
        >
          Close Tab
        </button>
      </div>
    </main>
  );
}

