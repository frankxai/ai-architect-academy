import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Update professor profile
const updateSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  bio: z.string().max(1000).optional(),
  expertise: z.array(z.string()).min(1).max(10).optional(),
  website: z.string().url().optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { professorId: string } }
) {
  try {
    const professor = await prisma.professorAccount.findUnique({
      where: { id: params.professorId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        listings: {
          where: { isPublished: true },
          include: {
            pattern: {
              select: {
                name: true,
                slug: true,
                difficulty: true,
                estimatedHours: true,
                techStack: true,
              },
            },
          },
          orderBy: [
            { isFeatured: 'desc' },
            { totalSales: 'desc' },
          ],
        },
        _count: {
          select: {
            listings: true,
            revenues: true,
            reviews: true,
          },
        },
      },
    });

    if (!professor) {
      return NextResponse.json(
        { error: 'Professor not found' },
        { status: 404 }
      );
    }

    // Calculate additional stats
    const stats = {
      totalListings: professor._count.listings,
      publishedListings: professor.listings.length,
      avgRating: professor.avgRating || 0,
      totalStudents: professor.totalStudents,
      totalRevenue: professor.totalRevenue,
    };

    return NextResponse.json({
      ...professor,
      stats,
    });
  } catch (error) {
    console.error('Get professor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { professorId: string } }
) {
  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const professor = await prisma.professorAccount.update({
      where: { id: params.professorId },
      data: {
        ...(data.displayName && { displayName: data.displayName }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.expertise && { expertise: data.expertise }),
        ...(data.website !== undefined && { website: data.website || null }),
        ...(data.github !== undefined && { github: data.github || null }),
        ...(data.linkedin !== undefined && { linkedin: data.linkedin || null }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      professor,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update professor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
