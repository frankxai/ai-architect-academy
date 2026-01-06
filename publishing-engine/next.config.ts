import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export for edge deployment
  output: 'export',
  trailingSlash: true,

  // Image optimization for static export
  images: {
    unoptimized: true,
  },

  // MDX support for content
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // Next.js 16.1: Turbopack is now default for dev and build
  // Next.js 16.1: React Compiler is stable
  experimental: {
    mdxRs: true,
    reactCompiler: true,
  },
};

export default nextConfig;
