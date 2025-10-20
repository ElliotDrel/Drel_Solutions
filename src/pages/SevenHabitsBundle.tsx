import { useEffect, useState } from 'react';
import { CheckCircle, Download } from 'lucide-react';
import { AVAILABLE_DOWNLOADS } from '@/hooks/use-download';

/**
 * Auto-download bundle page for 7 Habits resources
 * 
 * When users visit this page, all three files download automatically.
 * URL: /7-habits-bundle
 */
export default function SevenHabitsBundle() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    // Trigger all three downloads automatically
    const files = [
      AVAILABLE_DOWNLOADS['7-habits-detailed'],
      AVAILABLE_DOWNLOADS['7-habits-full-notes'],
      AVAILABLE_DOWNLOADS['7-habits-quadrants'],
    ];

    // Small delay to ensure page loads first
    const timer = setTimeout(() => {
      files.forEach((fileName, index) => {
        // Stagger downloads slightly to avoid browser blocking
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = `/downloads/${fileName}`;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
          
          setDownloadCount(prev => prev + 1);
        }, index * 300); // 300ms between each download
      });

      setDownloadStarted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Download className="h-10 w-10 text-primary animate-bounce" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            7 Habits Resource Bundle
          </h1>
          <p className="text-lg text-gray-600">
            Your downloads are starting automatically!
          </p>
        </div>

        {/* Download Progress */}
        <div className="space-y-4 mb-8">
          <div className={`flex items-center p-4 rounded-lg border-2 transition-all ${
            downloadCount >= 1 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <CheckCircle className={`h-5 w-5 mr-3 ${
              downloadCount >= 1 ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-900">
              Detailed Breakdown
            </span>
          </div>

          <div className={`flex items-center p-4 rounded-lg border-2 transition-all ${
            downloadCount >= 2 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <CheckCircle className={`h-5 w-5 mr-3 ${
              downloadCount >= 2 ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-900">
              Full Notes
            </span>
          </div>

          <div className={`flex items-center p-4 rounded-lg border-2 transition-all ${
            downloadCount >= 3 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <CheckCircle className={`h-5 w-5 mr-3 ${
              downloadCount >= 3 ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-900">
              Time Management Quadrants
            </span>
          </div>
        </div>

        {/* Content Description */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            What's Included:
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Detailed Breakdown:</strong> Comprehensive chapter-by-chapter analysis with key insights and teachings</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Full Notes:</strong> Complete notes covering all seven habits with actionable implementation steps</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Quadrants Overview:</strong> Deep dive into Stephen Covey's Time Management Matrix framework</span>
            </li>
          </ul>
        </div>

        {/* Status Message */}
        {downloadStarted && (
          <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Note:</strong> If your downloads don't start automatically, check your browser's download settings or pop-up blocker.
            </p>
            {downloadCount === 3 && (
              <p className="text-sm text-green-600 font-medium mt-3">
                ✓ All downloads complete! Check your Downloads folder.
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-500 mb-4">
            These resources are provided by <strong>Drel Solutions</strong>
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            Visit Our Website
          </a>
        </div>
      </div>
    </main>
  );
}

