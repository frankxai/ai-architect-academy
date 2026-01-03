'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Pattern {
  id: string;
  priceType: 'FREE' | 'PAID' | 'SUBSCRIPTION';
  price: number;
  isFeatured: boolean;
  totalSales: number;
  avgRating: number | null;
  reviewCount: number;
  pattern: {
    name: string;
    slug: string;
    description: string;
    difficulty: string;
    estimatedHours: number;
    techStack: string[];
    useCases: string[];
    demoUrl: string | null;
  };
  professor: {
    displayName: string;
    verified: boolean;
    avgRating: number | null;
    totalStudents: number;
  };
}

export default function MarketplacePage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    priceType: '',
    sortBy: 'popular',
  });

  useEffect(() => {
    fetchPatterns();
  }, [filters]);

  async function fetchPatterns() {
    try {
      const params = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.priceType && { priceType: filters.priceType }),
        sortBy: filters.sortBy,
        page: '1',
        limit: '20',
      });

      const res = await fetch(`/api/marketplace/patterns?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPatterns(data.listings);
      }
    } catch (error) {
      console.error('Failed to load patterns:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Pattern <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Production-ready patterns built by expert AI architects. Deploy in minutes.
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search patterns..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
            <select
              value={filters.priceType}
              onChange={(e) => setFilters({ ...filters, priceType: e.target.value })}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Prices</option>
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Pattern Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">
            Loading patterns...
          </div>
        ) : patterns.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No patterns found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PatternCard({ pattern }: { pattern: Pattern }) {
  return (
    <Link href={`/marketplace/patterns/${pattern.pattern.slug}`}>
      <div className="glass rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer group">
        {/* Badge */}
        {pattern.isFeatured && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1 text-white text-xs font-bold">
            ⭐ FEATURED
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {pattern.pattern.name}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {pattern.pattern.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              pattern.pattern.difficulty === 'BEGINNER'
                ? 'bg-green-500/20 text-green-300'
                : pattern.pattern.difficulty === 'INTERMEDIATE'
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              {pattern.pattern.difficulty}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
              {pattern.pattern.estimatedHours}h
            </span>
            {pattern.avgRating && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                ⭐ {pattern.avgRating.toFixed(1)} ({pattern.reviewCount})
              </span>
            )}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {pattern.pattern.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400"
              >
                {tech}
              </span>
            ))}
            {pattern.pattern.techStack.length > 3 && (
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                +{pattern.pattern.techStack.length - 3}
              </span>
            )}
          </div>

          {/* Professor */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {pattern.professor.displayName[0]}
              </div>
              <div>
                <div className="text-sm text-white flex items-center gap-1">
                  {pattern.professor.displayName}
                  {pattern.professor.verified && (
                    <span className="text-blue-400">✓</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {pattern.professor.totalStudents} students
                </div>
              </div>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            {pattern.priceType === 'FREE' ? (
              <div className="text-2xl font-bold text-green-400">FREE</div>
            ) : (
              <div className="text-2xl font-bold text-white">
                ${pattern.price}
              </div>
            )}
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              {pattern.priceType === 'FREE' ? 'Get Free' : 'Purchase'}
            </button>
          </div>

          {/* Sales */}
          {pattern.totalSales > 0 && (
            <div className="mt-3 text-xs text-gray-500 text-center">
              {pattern.totalSales} {pattern.totalSales === 1 ? 'sale' : 'sales'}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
