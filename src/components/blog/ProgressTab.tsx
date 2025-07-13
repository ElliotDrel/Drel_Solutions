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
      
      h2Elements.forEach((h2) => {
        const text = h2.textContent || '';
        h2Texts.push(text);
      });
      
      setH2Elements(h2Texts);
    };

    // Wait for content to be rendered
    setTimeout(extractH2Elements, 100);
  }, [content]);

  return (
    <div className="p-4 bg-background border border-border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">H2 Elements:</h3>
      <ul className="space-y-2">
        {h2Elements.map((text, index) => (
          <li key={index} className="text-sm text-foreground">
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}; 