'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProfessorStats {
  totalListings: number;
  publishedListings: number;
  avgRating: number;
  totalStudents: number;
  totalRevenue: number;
}

export default function ProfessorDashboard() {
  const [stats, setStats] = useState<ProfessorStats | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topPatterns, setTopPatterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual user ID from auth
    const mockProfessorId = 'prof_123';
    fetchDashboardData(mockProfessorId);
  }, []);

  async function fetchDashboardData(professorId: string) {
    try {
      const [analyticsRes] = await Promise.all([
        fetch(`/api/professors/${professorId}/analytics?period=30d`),
      ]);

      if (analyticsRes.ok) {
        const analytics = await analyticsRes.json();
        setStats(analytics.summary);
        setRevenueData(analytics.revenueTrend.slice(-7)); // Last 7 days
        setTopPatterns(analytics.topPatterns.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Professor Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Track your patterns, revenue, and student success
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue.toLocaleString() || 0}`}
            subtitle="Last 30 days"
            trend="+12%"
            icon="💰"
          />
          <StatCard
            title="Students Taught"
            value={stats?.totalStudents.toString() || '0'}
            subtitle="All time"
            trend="+8"
            icon="👥"
          />
          <StatCard
            title="Avg Rating"
            value={stats?.avgRating.toFixed(1) || '0.0'}
            subtitle={`Based on reviews`}
            icon="⭐"
          />
          <StatCard
            title="Active Patterns"
            value={stats?.publishedListings.toString() || '0'}
            subtitle={`${stats?.totalListings || 0} total`}
            icon="📦"
          />
        </div>

        {/* Revenue Chart */}
        <div className="glass rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Revenue Trend (Last 7 Days)
          </h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {revenueData.map((day, i) => {
              const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1);
              const height = (day.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-sm text-blue-400 font-medium">
                    ${day.revenue.toFixed(0)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Patterns */}
        <div className="glass rounded-2xl p-8 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Top Patterns</h2>
            <Link
              href="/professor/patterns"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {topPatterns.map((pattern, i) => (
              <div
                key={pattern.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-600">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {pattern.pattern.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {pattern.totalSales} sales • ${pattern.totalRevenue.toFixed(0)} revenue
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-yellow-400">
                      ⭐ {pattern.avgRating?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {pattern.reviewCount} reviews
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    pattern.pattern.difficulty === 'BEGINNER'
                      ? 'bg-green-500/20 text-green-300'
                      : pattern.pattern.difficulty === 'INTERMEDIATE'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {pattern.pattern.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Create Pattern"
            description="Build and publish a new deployable pattern"
            icon="✨"
            href="/professor/patterns/new"
          />
          <ActionCard
            title="Analytics"
            description="Deep dive into your performance metrics"
            icon="📊"
            href="/professor/analytics"
          />
          <ActionCard
            title="Settings"
            description="Manage your profile and payment settings"
            icon="⚙️"
            href="/professor/settings"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend?: string;
  icon: string;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="text-3xl">{icon}</div>
        {trend && (
          <span className="text-green-400 text-sm font-medium">{trend}</span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
        <div className="mt-4 text-blue-400 group-hover:text-blue-300 transition-colors">
          Get started →
        </div>
      </div>
    </Link>
  );
}
