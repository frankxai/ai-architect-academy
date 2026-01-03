import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { professorId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all-time'; // 'all-time', '30d', '7d'

    const professor = await prisma.professorAccount.findUnique({
      where: { id: params.professorId },
    });

    if (!professor) {
      return NextResponse.json(
        { error: 'Professor not found' },
        { status: 404 }
      );
    }

    // Calculate date range
    let dateFilter = {};
    if (period === '30d') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter = { purchasedAt: { gte: thirtyDaysAgo } };
    } else if (period === '7d') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      dateFilter = { purchasedAt: { gte: sevenDaysAgo } };
    }

    // Get purchases
    const purchases = await prisma.purchase.findMany({
      where: {
        listing: {
          professorId: params.professorId,
        },
        status: 'COMPLETED',
        ...dateFilter,
      },
      include: {
        listing: {
          include: {
            pattern: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    });

    // Calculate revenue by period
    const revenueByPeriod = await prisma.revenue.findMany({
      where: {
        professorId: params.professorId,
      },
      orderBy: { period: 'desc' },
      take: 12, // Last 12 months
    });

    // Top selling patterns
    const topPatterns = await prisma.patternListing.findMany({
      where: {
        professorId: params.professorId,
        isPublished: true,
      },
      orderBy: [
        { totalSales: 'desc' },
        { avgRating: 'desc' },
      ],
      take: 10,
      include: {
        pattern: {
          select: {
            name: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    });

    // Recent reviews
    const recentReviews = await prisma.review.findMany({
      where: {
        professorId: params.professorId,
        isPublished: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        listing: {
          include: {
            pattern: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // Calculate summary stats
    const totalSales = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.professorPayout, 0);
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Revenue trend (last 30 days)
    const revenueTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dayPurchases = purchases.filter(
        (p) =>
          p.purchasedAt.toDateString() === date.toDateString()
      );
      return {
        date: date.toISOString().split('T')[0],
        revenue: dayPurchases.reduce((sum, p) => sum + p.professorPayout, 0),
        sales: dayPurchases.length,
      };
    });

    return NextResponse.json({
      summary: {
        totalSales,
        totalRevenue,
        avgOrderValue,
        totalStudents: professor.totalStudents,
        avgRating: professor.avgRating || 0,
        totalReviews: professor.totalReviews,
      },
      revenueTrend,
      recentPurchases: purchases.slice(0, 20),
      topPatterns,
      recentReviews,
      revenueByPeriod,
    });
  } catch (error) {
    console.error('Get professor analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
