import { DownloadButton } from './DownloadButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AVAILABLE_DOWNLOADS } from '@/hooks/use-download';

/**
 * Demo component showing how to use the download functionality
 * 
 * This can be placed on any page where you want to offer downloadable resources
 */
export function DownloadDemo() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>7 Habits of Highly Effective People - Resources</CardTitle>
        <CardDescription>
          Download comprehensive notes and breakdowns from Stephen Covey's influential book
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Detailed Breakdown</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive chapter-by-chapter analysis with key insights
              </p>
            </div>
            <DownloadButton fileKey="7-habits-detailed" variant="outline">
              Download
            </DownloadButton>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Full Notes</h4>
              <p className="text-sm text-muted-foreground">
                Complete notes covering all seven habits and implementation steps
              </p>
            </div>
            <DownloadButton fileKey="7-habits-full-notes" variant="outline">
              Download
            </DownloadButton>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Time Management Quadrants</h4>
              <p className="text-sm text-muted-foreground">
                Deep dive into Covey's Time Management Matrix framework
              </p>
            </div>
            <DownloadButton fileKey="7-habits-quadrants" variant="outline">
              Download
            </DownloadButton>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            These resources are provided as plain text files (.txt) for easy reading and note-taking.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

