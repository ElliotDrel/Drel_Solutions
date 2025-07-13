import { useEffect, useState } from 'react';

interface ArticleProgressProps {
  content: string;
}

export const ArticleProgress: React.FC<ArticleProgressProps> = ({ content }) => {
  const [h2Elements, setH2Elements] = useState<string[]>([]);

  useEffect(() => {
    const extractH2Elements = () => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      const h2Elements = tempDiv.querySelectorAll('h2');
      const h2Texts: string[] = [];

      let i = 0;
      
      h2Elements.forEach((h2) => {
        const text = h2.textContent || '';
        h2Texts.push(text);
      });
      
      setH2Elements(h2Texts);
      
      // Add IDs to the actual h2 elements in the article content
      setTimeout(() => {
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
          const actualH2Elements = articleContent.querySelectorAll('h2');
          actualH2Elements.forEach((h2, index) => {
            h2.id = `h2-${index}`;
          });
        }
      }, 200); // Wait a bit longer for content to be fully rendered
    };

    // Wait for content to be rendered
    setTimeout(extractH2Elements, 100);
  }, [content]);

  return (
    <div className="p-4 bg-background border border-border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Sections:</h3>
      <ul className="space-y-2">
        {h2Elements.map((text, index) => (
          <li key={index} className="text-sm text-foreground">
            <a href={`#h2-${index}`} className="hover:text-primary transition-colors">
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}; 