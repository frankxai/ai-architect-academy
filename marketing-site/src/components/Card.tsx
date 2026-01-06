import Link from 'next/link';
import { clsx } from 'clsx';
import { ArrowRight, Clock, BookOpen, Sparkles } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  href: string;
  category?: string;
  categoryColor?: string;
  badge?: string;
  meta?: string;
  icon?: React.ReactNode;
}

export function Card({
  title,
  description,
  href,
  category,
  categoryColor = 'from-purple-500 to-pink-500',
  badge,
  meta,
  icon,
}: CardProps) {
  return (
    <Link
      href={href}
      className="group relative block rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-purple-500/10"
    >
      {/* Badge */}
      {badge && (
        <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}

      {/* Category */}
      {category && (
        <span
          className={clsx(
            'inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium text-white',
            categoryColor
          )}
        >
          {icon || <Sparkles className="h-3 w-3" />}
          {category}
        </span>
      )}

      {/* Title */}
      <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-slate-400 line-clamp-2">{description}</p>

      {/* Meta */}
      {meta && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          {meta}
        </div>
      )}

      {/* Arrow */}
      <div className="mt-4 flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300">
        Learn more
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient?: string;
}

export function FeatureCard({ title, description, icon, gradient = 'from-purple-500 to-cyan-500' }: FeatureCardProps) {
  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 overflow-hidden">
      <div className={clsx('absolute inset-0 bg-gradient-to-br opacity-5', gradient)} />
      <div
        className={clsx(
          'relative inline-flex items-center justify-center rounded-xl bg-gradient-to-br p-3',
          gradient
        )}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

interface StatsCardProps {
  value: string;
  label: string;
  gradient?: string;
}

export function StatsCard({ value, label, gradient = 'from-purple-400 to-cyan-400' }: StatsCardProps) {
  return (
    <div className="text-center">
      <div className={clsx('text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent', gradient)}>
        {value}
      </div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}
