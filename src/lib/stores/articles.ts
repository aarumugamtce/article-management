import type { Article } from '$lib/types';

let nextId = 1;

const sampleTitles = [
  'Getting Started with React Hooks', 'Advanced TypeScript Patterns', 'Building Scalable APIs',
  'CSS Grid vs Flexbox Guide', 'Database Optimization Tips', 'Modern JavaScript Features',
  'Docker for Beginners', 'GraphQL Best Practices', 'Testing Strategies', 'Performance Monitoring',
  'Security in Web Apps', 'Microservices Architecture', 'State Management Solutions',
  'Progressive Web Apps', 'Serverless Computing', 'Machine Learning Basics',
  'DevOps Pipeline Setup', 'Mobile-First Design', 'API Documentation', 'Code Review Process',
  'Agile Development', 'Clean Code Principles', 'Design Patterns', 'Version Control',
  'Continuous Integration', 'User Experience Design', 'Accessibility Guidelines',
  'Cross-Browser Testing', 'SEO Optimization', 'Content Strategy', 'Digital Marketing',
  'Data Analytics', 'Cloud Computing', 'Cybersecurity Fundamentals', 'AI Ethics',
  'Blockchain Technology', 'IoT Development', 'AR/VR Applications', 'Game Development',
  'E-commerce Solutions', 'Social Media Integration', 'Payment Processing', 'Email Marketing',
  'Customer Support Systems', 'Project Management', 'Team Collaboration', 'Remote Work',
  'Productivity Tools', 'Time Management', 'Leadership Skills', 'Communication Strategies'
];

const authors = ['Jane Doe', 'John Smith', 'Alice Johnson', 'Bob Wilson', 'Sarah Chen', 'Mike Rodriguez', 'Emma Thompson', 'David Kim'];

const initialArticles: Article[] = [
  { id: nextId++, title: 'Welcome to Our Platform', status: 'Published', author: 'Jane Doe', createdAt: '2024-01-15T10:00:00Z' },
  { id: nextId++, title: 'Draft: Upcoming Features', status: 'Draft', author: 'John Smith', createdAt: '2024-02-20T14:30:00Z' },
  ...Array.from({ length: 98 }, (_, i) => ({
    id: nextId++,
    title: sampleTitles[i % sampleTitles.length],
    status: (i % 3 === 0 ? 'Draft' : 'Published') as 'Published' | 'Draft',
    author: authors[i % authors.length],
    createdAt: new Date(2024, (i % 12), Math.floor(i / 4) + 1, 9 + (i % 14), (i * 7) % 60).toISOString()
  }))
];

export const articles = {
  value: initialArticles,
  get: () => articles.value,
  set: (newArticles: Article[]) => { articles.value = newArticles; }
};

export function addArticle(newArticle: Omit<Article, 'id' | 'createdAt'>) {
  articles.value = [...articles.value, { ...newArticle, id: nextId++, createdAt: new Date().toISOString() }];
}

export function updateArticle(updated: Article) {
  const index = articles.value.findIndex((a) => a.id === updated.id);
  if (index !== -1) articles.value = [...articles.value.slice(0, index), updated, ...articles.value.slice(index + 1)];
}

export function deleteArticle(id: number) {
  const index = articles.value.findIndex((a) => a.id === id);
  if (index !== -1) articles.value = [...articles.value.slice(0, index), ...articles.value.slice(index + 1)];
}