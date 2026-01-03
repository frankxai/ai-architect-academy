import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for professor onboarding
const onboardSchema = z.object({
  userId: z.string().cuid(),
  displayName: z.string().min(2).max(100),
  bio: z.string().max(1000).optional(),
  expertise: z.array(z.string()).min(1).max(10),
  website: z.string().url().optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  tier: z.enum(['COMMUNITY', 'CREATOR', 'EXPERT']).default('COMMUNITY'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = onboardSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already a professor
    const existing = await prisma.professorAccount.findUnique({
      where: { userId: data.userId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'User is already a professor' },
        { status: 400 }
      );
    }

    // Create professor account
    const professor = await prisma.professorAccount.create({
      data: {
        userId: data.userId,
        displayName: data.displayName,
        bio: data.bio,
        expertise: data.expertise,
        website: data.website || null,
        github: data.github || null,
        linkedin: data.linkedin || null,
        tier: data.tier,
        verified: false,
        payoutEnabled: false,
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

    // Update user role
    await prisma.user.update({
      where: { id: data.userId },
      data: { role: 'PROFESSOR' },
    });

    return NextResponse.json({
      success: true,
      professor,
      message: 'Successfully onboarded as professor',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Professor onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const professor = await prisma.professorAccount.findUnique({
      where: { userId },
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
              },
            },
          },
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

    return NextResponse.json(professor);
  } catch (error) {
    console.error('Get professor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
