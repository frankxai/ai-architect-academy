import Link from 'next/link';
import { Brain, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  learn: [
    { name: '100-Hour AI Architect', href: '/paths/100-hour-ai-architect/' },
    { name: 'Beginner Path', href: '/paths/beginner/' },
    { name: 'Professional Path', href: '/paths/professional/' },
    { name: 'Bootcamp', href: '/paths/bootcamp/' },
  ],
  resources: [
    { name: 'All Skills', href: '/skills/' },
    { name: 'Architecture Patterns', href: '/patterns/' },
    { name: 'Learning Paths', href: '/paths/' },
    { name: 'AGI Research Track', href: '/paths/agi-research/' },
  ],
  worldProblems: [
    { name: 'Climate AI', href: '/paths/climate-ai/' },
    { name: 'Health AI', href: '/paths/health-ai/' },
    { name: 'Education AI', href: '/paths/education-ai/' },
    { name: 'Economic AI', href: '/paths/economic-ai/' },
  ],
  company: [
    { name: 'About', href: '/about/' },
    { name: 'Pricing', href: '/pricing/' },
    { name: 'Contact', href: '/contact/' },
    { name: 'Privacy', href: '/privacy/' },
  ],
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/frankx/ai-architect-academy', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com/aiarchitectacad', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/ai-architect-academy', icon: Linkedin },
  { name: 'Email', href: 'mailto:hello@aiarchitectacademy.com', icon: Mail },
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
              Design, Ship & Operate production AI systems with 80+ skills, 60+ agents, and 200+ patterns.
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

          {/* Learn */}
          <div>
            <h3 className="text-sm font-semibold text-white">Learn</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* World Problems */}
          <div>
            <h3 className="text-sm font-semibold text-white">World Problems</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.worldProblems.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
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
            &copy; {new Date().getFullYear()} AI Architect Academy. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built for the AI-native generation
          </p>
        </div>
      </div>
    </footer>
  );
}
