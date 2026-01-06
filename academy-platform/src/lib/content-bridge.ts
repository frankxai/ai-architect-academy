import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the roots relative to the CWD (which is academy-platform/ when running Next.js)
// When running in Vercel, we need to ensure we can access the parent dir.
const REPO_ROOT = path.join(process.cwd(), '..');
const PATTERNS_DIR = path.join(REPO_ROOT, '01-design-patterns');

export interface DesignPattern {
  slug: string;
  title: string;
  description: string;
  content: string;
  metadata: Record<string, any>;
}

export function getAllPatterns(): DesignPattern[] {
  // Safety check: if we are not in the expected structure (e.g. docker without volume), return empty
  if (!fs.existsSync(PATTERNS_DIR)) {
    console.warn(`Patterns directory not found at: ${PATTERNS_DIR}`);
    return [];
  }

  const files = fs.readdirSync(PATTERNS_DIR);
  
  const patterns = files
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .map((file) => {
      const filePath = path.join(PATTERNS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace('.md', ''),
        title: data.title || file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Fallback title
        description: data.description || content.slice(0, 150) + '...', // Fallback description
        content,
        metadata: data,
      };
    });

  return patterns;
}

export function getPatternBySlug(slug: string): DesignPattern | null {
  const filePath = path.join(PATTERNS_DIR, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: data.description || '',
    content,
    metadata: data,
  };
}
