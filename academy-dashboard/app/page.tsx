import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="max-w-6xl w-full text-center space-y-8">
        {/* Logo/Badge */}
        <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full text-sm">
          <span className="text-emerald-400 font-bold">🚀 AI Architect Academy MVP</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">Launch Week</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="gradient-text">Master AI Architecture</span>
          <br />
          <span className="text-white">Through Adaptive Learning</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Learn by building. Deploy real systems with{" "}
          <span className="text-blue-400 font-semibold">agent-powered patterns</span>,{" "}
          <span className="text-purple-400 font-semibold">sell your expertise</span>, and{" "}
          <span className="text-emerald-400 font-semibold">showcase your portfolio</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/onboarding"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Start Building →</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
          </Link>

          <Link
            href="/marketplace"
            className="glass px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
          >
            Browse Patterns
          </Link>

          <Link
            href="/professor"
            className="glass px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border border-purple-500/30"
          >
            Become a Professor
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
          {[
            { value: "500+", label: "Deployable Patterns", icon: "📦" },
            { value: "100+", label: "Expert Professors", icon: "👨‍🏫" },
            { value: "10k+", label: "Systems Deployed", icon: "🚀" },
            { value: "70%", label: "Professor Revenue", icon: "💰" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
          {[
            {
              icon: "🎓",
              title: "Learn by Building",
              description: "Deploy production systems while mastering AI architecture patterns",
            },
            {
              icon: "💎",
              title: "Sell Your Expertise",
              description: "Create patterns, earn 70% revenue, build your reputation",
            },
            {
              icon: "🎯",
              title: "Agent Workflows",
              description: "Step-by-step prompts for Claude Code, Kilo, and other coding agents",
            },
            {
              icon: "🏢",
              title: "Enterprise Ready",
              description: "Team licenses, custom tracks, and talent pipeline integration",
            },
            {
              icon: "📊",
              title: "Portfolio Showcase",
              description: "Every system you deploy becomes part of your public portfolio",
            },
            {
              icon: "🤝",
              title: "Strategic Partnerships",
              description: "Cloud credits, API access, co-marketing with industry leaders",
            },
          ].map((feature, i) => (
            <div key={i} className="glass rounded-2xl p-8 text-left hover:border-blue-500/50 transition-all duration-300">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Three-Sided Marketplace */}
        <div className="pt-16 max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-white text-center">Three-Sided Marketplace</h2>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Students learn by deploying. Professors earn by teaching. Enterprises hire certified talent.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Students",
                icon: "🎓",
                color: "from-blue-500 to-blue-700",
                description: "Deploy real systems, earn certifications, showcase portfolio",
                pricing: "Free - $99/mo",
              },
              {
                name: "Professors",
                icon: "👨‍🏫",
                color: "from-purple-500 to-purple-700",
                description: "Create patterns, teach workshops, earn 70% revenue",
                pricing: "$99 - $299/mo",
              },
              {
                name: "Enterprises",
                icon: "🏢",
                color: "from-emerald-500 to-emerald-700",
                description: "Hire talent, train teams, custom tracks",
                pricing: "$5k - $100k/year",
              },
            ].map((segment, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300"
              >
                <div className={`text-6xl mb-4 inline-block p-4 rounded-2xl bg-gradient-to-br ${segment.color}`}>
                  {segment.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{segment.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{segment.description}</p>
                <div className="text-emerald-400 font-bold">{segment.pricing}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-16 pb-8">
          <div className="glass rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to build AI systems that matter?
            </h2>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Join the platform where learning meets building. Deploy your first system today,
              or start earning by sharing your patterns with thousands of architects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="inline-block px-12 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                Start Building →
              </Link>
              <Link
                href="/professor"
                className="inline-block px-12 py-4 glass border border-purple-500/30 rounded-xl font-bold text-xl hover:bg-white/10 transition-all duration-300"
              >
                Become a Professor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
