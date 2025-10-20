import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Component to share the 7 Habits Bundle download link
 * 
 * Displays the shareable URL and provides copy functionality
 */
export function ShareBundleLink() {
  const [copied, setCopied] = useState(false);
  
  // Use the actual domain when in production, localhost for dev
  const bundleUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/7-habits-bundle`
    : 'https://drelsolutions.com/7-habits-bundle';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bundleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Share 7 Habits Resources</CardTitle>
        <CardDescription>
          Share this link with anyone to give them instant access to all three resource files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Display */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
          <code className="flex-1 text-sm text-gray-700 font-mono break-all">
            {bundleUrl}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Preview Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            onClick={() => window.open(bundleUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview Download Page
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>What happens when someone visits this link:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              <span>They see a beautiful landing page</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              <span>All three files download automatically</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              <span>They get a summary of what's included</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

