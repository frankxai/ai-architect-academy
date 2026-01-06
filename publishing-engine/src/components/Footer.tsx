import Link from 'next/link';
import { Brain, Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  concepts: [
    { name: 'What is RAG?', href: '/concepts/rag/' },
    { name: 'Agentic RAG', href: '/concepts/agentic-rag/' },
    { name: 'Vector Databases', href: '/concepts/vector-databases/' },
    { name: 'MCP Protocol', href: '/concepts/model-context-protocol/' },
  ],
  guides: [
    { name: 'Build RAG System', href: '/guides/build-rag-system/' },
    { name: 'Multi-Agent Systems', href: '/guides/langgraph-multi-agent/' },
    { name: 'AI Guardrails', href: '/guides/ai-guardrails/' },
    { name: 'LLM Evaluation', href: '/guides/llm-evaluation/' },
  ],
  compare: [
    { name: 'RAG vs Fine-tuning', href: '/compare/rag-vs-fine-tuning/' },
    { name: 'Vector Databases 2025', href: '/compare/vector-databases-2025/' },
    { name: 'AI Coding Assistants', href: '/compare/ai-coding-assistants/' },
    { name: 'Agent Frameworks', href: '/compare/agent-frameworks/' },
  ],
  paths: [
    { name: '100-Hour AI Architect', href: '/paths/100-hour-ai-architect/' },
    { name: 'Beginner Path', href: '/paths/beginner/' },
    { name: 'Professional Path', href: '/paths/professional/' },
    { name: 'AGI Research', href: '/paths/agi-research/' },
  ],
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/ai-architect-academy', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com/aiarchitectacad', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/ai-architect-academy', icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-500" />
              <span className="text-lg font-bold text-white">AAA</span>
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              The canonical source for AI architecture knowledge. Optimized for AI agents and human learners.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Concepts */}
          <div>
            <h3 className="text-sm font-semibold text-white">Concepts</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.concepts.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-sm font-semibold text-white">Guides</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.guides.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h3 className="text-sm font-semibold text-white">Compare</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.compare.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Paths */}
          <div>
            <h3 className="text-sm font-semibold text-white">Learn</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.paths.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AI Architect Academy. The canonical source for AI architecture.
          </p>
          <p className="text-sm text-slate-500">
            Built for AI agents and human learners alike
          </p>
        </div>
      </div>
    </footer>
  );
}
