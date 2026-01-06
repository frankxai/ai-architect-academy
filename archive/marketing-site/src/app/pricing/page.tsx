import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle2, Sparkles, Building2, Users, Github, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing - AI Architect Academy',
  description:
    'Choose your AI Architect Academy plan. Free open-source curriculum, SaaS platform with AI mentors, or Enterprise solutions for organizations.',
  keywords: ['ai training pricing', 'ai course cost', 'enterprise ai training', 'ai certification'],
  openGraph: {
    title: 'Pricing - AI Architect Academy',
    description: 'Choose your AI Architect Academy plan',
    url: 'https://ai-architect-academy.vercel.app/pricing/',
  },
};

const plans = [
  {
    name: 'Open Source',
    description: 'Community-driven learning for self-starters',
    price: 'Free',
    period: 'forever',
    icon: Github,
    gradient: 'from-slate-600 to-slate-700',
    features: [
      'Full curriculum access',
      '80+ skills documentation',
      '200+ architecture patterns',
      '9 learning paths',
      'GitHub repository access',
      'Community Discord',
      'Self-paced learning',
    ],
    cta: 'Start Learning',
    ctaHref: '/paths/100-hour-ai-architect/',
    highlighted: false,
  },
  {
    name: 'Pro',
    description: 'AI-powered mentorship and hands-on projects',
    price: '$49',
    period: '/month',
    icon: Sparkles,
    gradient: 'from-purple-600 to-cyan-600',
    features: [
      'Everything in Open Source',
      'AI mentor assistance',
      'Interactive code labs',
      'Project templates',
      'Progress tracking',
      'Certificate of completion',
      'Priority support',
      'Early access to new content',
    ],
    cta: 'Coming Soon',
    ctaHref: '#',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    description: 'Custom training for organizations',
    price: 'Custom',
    period: '',
    icon: Building2,
    gradient: 'from-amber-500 to-orange-600',
    features: [
      'Everything in Pro',
      'Custom learning paths',
      'Team management dashboard',
      'SSO integration',
      'Dedicated success manager',
      'On-premise deployment option',
      'Custom workshops',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact/',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-sm text-purple-300 mb-6">
              <Sparkles className="h-4 w-4" />
              Simple Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Choose Your Learning Journey
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Start free with our open-source curriculum, or unlock AI mentorship and enterprise
              features
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlighted
                    ? 'border-purple-500 bg-slate-900 shadow-xl shadow-purple-500/20'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-1 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                )}

                <div
                  className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} p-3 mb-4`}
                >
                  <plan.icon className="h-6 w-6 text-white" />
                </div>

                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{plan.description}</p>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`mt-8 block w-full rounded-xl py-3 text-center font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500'
                      : 'border border-slate-700 text-white hover:border-purple-500/50 hover:bg-slate-800'
                  } ${plan.cta === 'Coming Soon' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <section className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6">
                <h3 className="font-semibold text-white">Is the Open Source plan really free?</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Yes! Our core curriculum is completely free and open source. You can access all
                  80+ skills, 200+ patterns, and 9 learning paths without paying anything.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6">
                <h3 className="font-semibold text-white">What&apos;s included in AI mentorship?</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Pro subscribers get access to AI-powered mentors that can answer questions, review
                  code, explain concepts, and guide you through projects in real-time.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6">
                <h3 className="font-semibold text-white">Can I switch plans later?</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Absolutely. You can upgrade or downgrade your plan at any time. Your progress is
                  always saved regardless of your subscription level.
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6">
                <h3 className="font-semibold text-white">
                  Do you offer team or educational discounts?
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Yes! Contact us for enterprise pricing or educational institution discounts.
                  We&apos;re committed to making AI education accessible.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-24 text-center">
            <h2 className="text-2xl font-bold text-white">Ready to Start?</h2>
            <p className="mt-2 text-slate-400">
              Begin your AI architect journey today with our free curriculum
            </p>
            <Link
              href="/paths/100-hour-ai-architect/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-8 py-4 font-semibold text-white hover:from-purple-500 hover:to-cyan-500 transition-all"
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
