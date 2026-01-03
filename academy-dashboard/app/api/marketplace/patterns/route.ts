import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Filters
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty');
    const industry = searchParams.get('industry');
    const priceType = searchParams.get('priceType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'popular'; // popular, newest, rating, price

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isPublished: true,
      pattern: {
        publishedAt: { not: null },
      },
    };

    if (search) {
      where.OR = [
        { pattern: { name: { contains: search, mode: 'insensitive' } } },
        { pattern: { description: { contains: search, mode: 'insensitive' } } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    if (difficulty) {
      where.pattern = {
        ...where.pattern,
        difficulty,
      };
    }

    if (industry) {
      where.industries = { has: industry };
    }

    if (priceType) {
      where.priceType = priceType;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { publishedAt: 'desc' };
        break;
      case 'rating':
        orderBy = [{ avgRating: 'desc' }, { reviewCount: 'desc' }];
        break;
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'popular':
      default:
        orderBy = [
          { isFeatured: 'desc' },
          { totalSales: 'desc' },
          { avgRating: 'desc' },
        ];
    }

    // Execute query
    const [listings, total] = await Promise.all([
      prisma.patternListing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          pattern: {
            select: {
              name: true,
              slug: true,
              description: true,
              difficulty: true,
              estimatedHours: true,
              pointValue: true,
              techStack: true,
              useCases: true,
              demoUrl: true,
            },
          },
          professor: {
            select: {
              id: true,
              displayName: true,
              verified: true,
              avgRating: true,
              totalStudents: true,
            },
          },
        },
      }),
      prisma.patternListing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error('Get marketplace patterns error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
