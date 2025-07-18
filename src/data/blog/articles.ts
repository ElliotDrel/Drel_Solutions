import { BlogPost } from '@/types/blog';

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Streamlining Team Workflows with Automation',
    subtitle: 'How we reduced manual tasks by 70% using smart process automation',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop',
    author: { name: 'Sarah Chen', slug: 'sarah-chen' },
    readingTime: 8,
    tags: ['workflow', 'automation', 'productivity'],
    publishedAt: '2024-01-15',
    slug: 'streamlining-team-workflows'
  },
  {
    id: '2',
    title: 'The Hidden Costs of Manual Processes',
    subtitle: 'Understanding the true impact of inefficient workflows on your bottom line',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
    author: { name: 'Marcus Rodriguez', slug: 'marcus-rodriguez' },
    readingTime: 6,
    tags: ['processes', 'efficiency', 'cost-analysis'],
    publishedAt: '2024-01-12',
    slug: 'hidden-costs-manual-processes'
  }
];

export const articleContent: Record<string, string> = {
  'streamlining-team-workflows': `
    <h2>The Challenge of Manual Workflows</h2>
    <p>In today's fast-paced business environment, manual workflows can be a significant bottleneck to productivity and growth. Teams often find themselves caught in repetitive tasks that consume valuable time and resources.</p>
    
    <h2>Identifying Automation Opportunities</h2>
    <p>The first step in streamlining workflows is identifying which processes can benefit from automation. Look for tasks that are:</p>
    <ul>
      <li>Repetitive and time-consuming</li>
      <li>Prone to human error</li>
      <li>Following a predictable pattern</li>
      <li>Currently creating bottlenecks</li>
    </ul>
    
    <h2>Implementation Strategy</h2>
    <p>Our approach to workflow automation focuses on gradual implementation and continuous improvement. We start with the highest-impact, lowest-risk processes and build from there.</p>
    
    <h2>Measuring Success</h2>
    <p>After implementing automation, we track key metrics including time saved, error reduction, and team satisfaction. The results speak for themselves - our clients typically see a 70% reduction in manual tasks within the first quarter.</p>
    
    <h2>Next Steps</h2>
    <p>Ready to streamline your team's workflows? Contact us today to discuss how automation can transform your business processes.</p>
  `,
  'hidden-costs-manual-processes': `
    <h2>The True Cost of Manual Work</h2>
    <p>When businesses calculate the cost of manual processes, they often only consider the obvious expenses: employee salaries and direct time investment. However, the hidden costs can be even more significant.</p>
    
    <h2>Error Correction and Rework</h2>
    <p>Manual processes are inherently prone to human error. The cost of fixing mistakes, re-doing work, and managing the downstream effects of errors can be substantial.</p>
    
    <h2>Opportunity Cost</h2>
    <p>Every hour spent on manual tasks is an hour not spent on strategic initiatives, customer service, or business development. This opportunity cost compounds over time.</p>
    
    <h2>Employee Satisfaction</h2>
    <p>Repetitive manual work leads to decreased job satisfaction, higher turnover rates, and increased recruitment costs. Investing in process improvement pays dividends in employee retention.</p>
    
    <h2>Case Study Results</h2>
    <p>Our analysis of 50 small to medium businesses revealed that manual processes were costing an average of $45,000 per year in hidden expenses - far more than the cost of automation solutions.</p>
  `
};