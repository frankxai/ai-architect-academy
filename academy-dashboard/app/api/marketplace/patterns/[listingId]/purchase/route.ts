import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const purchaseSchema = z.object({
  userId: z.string().cuid(),
  paymentMethodId: z.string().optional(), // Stripe payment method ID
});

export async function POST(
  req: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = purchaseSchema.parse(body);

    // Get listing with pattern and professor
    const listing = await prisma.patternListing.findUnique({
      where: { id: params.listingId },
      include: {
        pattern: true,
        professor: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Pattern listing not found' },
        { status: 404 }
      );
    }

    if (!listing.isPublished) {
      return NextResponse.json(
        { error: 'Pattern is not available for purchase' },
        { status: 400 }
      );
    }

    // Check if user already purchased
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId,
        listingId: params.listingId,
        status: { in: ['COMPLETED', 'PENDING'] },
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You already own this pattern' },
        { status: 400 }
      );
    }

    // Handle free patterns
    if (listing.priceType === 'FREE' || listing.price === 0) {
      const purchase = await prisma.$transaction(async (tx) => {
        // Create purchase record
        const purchase = await tx.purchase.create({
          data: {
            userId,
            listingId: params.listingId,
            amount: 0,
            platformFee: 0,
            professorPayout: 0,
            status: 'COMPLETED',
            accessGranted: true,
          },
        });

        // Update listing stats
        await tx.patternListing.update({
          where: { id: params.listingId },
          data: {
            totalSales: { increment: 1 },
          },
        });

        // Update professor stats
        await tx.professorAccount.update({
          where: { id: listing.professorId },
          data: {
            totalStudents: { increment: 1 },
          },
        });

        // Create activity
        await tx.activity.create({
          data: {
            userId,
            type: 'COMPLETED_KP',
            description: `Acquired free pattern: ${listing.pattern.name}`,
            pointsEarned: 0,
            metadata: {
              patternId: listing.patternId,
              listingId: params.listingId,
            },
          },
        });

        return purchase;
      });

      return NextResponse.json({
        success: true,
        purchase,
        message: 'Pattern acquired successfully',
      });
    }

    // Handle paid patterns
    const amount = listing.price;
    const platformFee = amount * 0.3; // 30% platform fee
    const professorPayout = amount * 0.7; // 70% to professor

    // TODO: Integrate with Stripe for actual payment processing
    // For now, create a pending purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        listingId: params.listingId,
        amount,
        platformFee,
        professorPayout,
        status: 'PENDING',
        accessGranted: false,
        // stripePaymentId: stripePaymentIntent.id,
      },
    });

    return NextResponse.json({
      success: true,
      purchase,
      message: 'Payment initiated. Complete payment to access pattern.',
      // In production, return Stripe client secret
      // clientSecret: stripePaymentIntent.client_secret,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Webhook endpoint to handle successful payments
export async function PATCH(
  req: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    const body = await req.json();
    const { purchaseId, stripePaymentId } = body;

    // Complete the purchase
    const purchase = await prisma.$transaction(async (tx) => {
      // Update purchase
      const purchase = await tx.purchase.update({
        where: { id: purchaseId },
        data: {
          status: 'COMPLETED',
          accessGranted: true,
          completedAt: new Date(),
          stripePaymentId,
        },
        include: {
          listing: {
            include: {
              pattern: true,
              professor: true,
            },
          },
        },
      });

      // Update listing stats
      await tx.patternListing.update({
        where: { id: purchase.listingId },
        data: {
          totalSales: { increment: 1 },
          totalRevenue: { increment: purchase.amount },
        },
      });

      // Update professor stats
      await tx.professorAccount.update({
        where: { id: purchase.listing.professorId },
        data: {
          totalStudents: { increment: 1 },
          totalRevenue: { increment: purchase.professorPayout },
        },
      });

      // Create activity
      await tx.activity.create({
        data: {
          userId: purchase.userId,
          type: 'COMPLETED_KP',
          description: `Purchased pattern: ${purchase.listing.pattern.name}`,
          pointsEarned: purchase.listing.pattern.pointValue,
          metadata: {
            patternId: purchase.listing.patternId,
            listingId: purchase.listingId,
            amount: purchase.amount,
          },
        },
      });

      // Update or create revenue record for this month
      const period = new Date().toISOString().slice(0, 7); // YYYY-MM
      await tx.revenue.upsert({
        where: {
          professorId_period: {
            professorId: purchase.listing.professorId,
            period,
          },
        },
        update: {
          grossRevenue: { increment: purchase.amount },
          platformFee: { increment: purchase.platformFee },
          netRevenue: { increment: purchase.professorPayout },
        },
        create: {
          professorId: purchase.listing.professorId,
          period,
          grossRevenue: purchase.amount,
          platformFee: purchase.platformFee,
          netRevenue: purchase.professorPayout,
          payoutStatus: 'PENDING',
        },
      });

      return purchase;
    });

    return NextResponse.json({
      success: true,
      purchase,
      message: 'Purchase completed successfully',
    });
  } catch (error) {
    console.error('Complete purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
