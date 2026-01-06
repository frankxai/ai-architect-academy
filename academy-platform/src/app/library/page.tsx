import Link from 'next/link';
import { getAllPatterns } from '@/lib/content-bridge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LibraryPage() {
  const patterns = getAllPatterns();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Architect Library</h1>
        <p className="text-muted-foreground text-lg">
          Production-grade design patterns from the Open Source Knowledge Base.
          <br />
          <span className="text-sm opacity-70">Synced directly from /01-design-patterns</span>
        </p>
      </div>

      {patterns.length === 0 ? (
        <div className="p-8 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200">
          <h3 className="font-semibold">No patterns found</h3>
          <p>Could not locate the patterns directory. Ensure the app is running in the correct monorepo structure.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patterns.map((pattern) => (
            <Link key={pattern.slug} href={`/library/${pattern.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader>
                  <CardTitle className="text-xl">{pattern.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {pattern.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
                      Pattern
                    </span>
                    {pattern.metadata.tags && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        {pattern.metadata.tags[0]}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
