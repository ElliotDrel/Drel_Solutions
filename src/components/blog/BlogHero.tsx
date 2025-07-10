import { Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BlogHero = () => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          New at Drel Solutions Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover practical insights on workflow optimization, process automation, 
          and building efficient systems that scale with your business.
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <a href="https://twitter.com/drelsolutions" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://linkedin.com/company/drelsolutions" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://github.com/drelsolutions" target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};