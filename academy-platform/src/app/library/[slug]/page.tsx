import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPatternBySlug } from '@/lib/content-bridge';

export default function PatternDetailPage({ params }: { params: { slug: string } }) {
  const pattern = getPatternBySlug(params.slug);

  if (!pattern) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-6 text-sm text-muted-foreground">
        <Link className="hover:text-primary" href="/library">
          ← Back to Library
        </Link>
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-2">{pattern.title}</h1>
      {pattern.description && (
        <p className="text-lg text-muted-foreground mb-6">{pattern.description}</p>
      )}

      <div className="rounded-lg border bg-card p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => <h1 className="text-3xl font-semibold mt-6 mb-3" {...props} />,
            h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
            h3: (props) => <h3 className="text-xl font-semibold mt-5 mb-2" {...props} />,
            p: (props) => <p className="leading-relaxed text-sm text-foreground/90 mt-3" {...props} />,
            ul: (props) => <ul className="list-disc pl-6 mt-3 space-y-2 text-sm" {...props} />,
            ol: (props) => <ol className="list-decimal pl-6 mt-3 space-y-2 text-sm" {...props} />,
            li: (props) => <li className="leading-relaxed" {...props} />,
            a: (props) => <a className="text-primary underline underline-offset-4" {...props} />,
            code: ({ inline, ...props }) =>
              inline ? (
                <code className="rounded bg-muted px-1 py-0.5 text-xs" {...props} />
              ) : (
                <code className="text-xs" {...props} />
              ),
            pre: (props) => (
              <pre className="rounded-md bg-muted p-4 text-xs overflow-x-auto mt-4" {...props} />
            ),
            blockquote: (props) => (
              <blockquote className="border-l-2 border-primary/40 pl-4 text-sm text-muted-foreground mt-4" {...props} />
            ),
          }}
        >
          {pattern.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
