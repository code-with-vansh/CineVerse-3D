import crypto from 'crypto';
import prisma from '../config/database.js';
import { cleanExpiredLocks } from './seatService.js';

export const holdSeats = async ({ showId, seatIds, userId = null, guestEmail = null, guestName = null }) => {
  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    const error = new Error('No seats provided for reservation.');
    error.statusCode = 400;
    throw error;
  }

  if (seatIds.length > 8) {
    const error = new Error('Maximum 8 seats allowed per booking transaction.');
    error.statusCode = 400;
    throw error;
  }

  // Generate unique locking identifier
  const lockIdentifier = userId ? `user_${userId}` : `guest_${crypto.randomBytes(8).toString('hex')}`;
  const holdMinutes = parseInt(process.env.SEAT_HOLD_DURATION_MINUTES || '5', 10);
  const lockedUntil = new Date(Date.now() + holdMinutes * 60 * 1000);

  // Revert any expired locks first
  await cleanExpiredLocks(showId);

  // Execute atomic transactional hold
  const result = await prisma.$transaction(async (tx) => {
    // 1. Verify show exists
    const show = await tx.show.findUnique({
      where: { id: showId },
      include: {
        screen: true,
      },
    });

    if (!show) {
      const error = new Error('The requested show does not exist.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Fetch seats and ensure they all belong to this screen
    const physicalSeats = await tx.seat.findMany({
      where: {
        id: { in: seatIds },
        screenId: show.screenId,
      },
    });

    if (physicalSeats.length !== seatIds.length) {
      const error = new Error('One or more selected seats do not belong to this screen auditorium.');
      error.statusCode = 400;
      throw error;
    }

    // 3. Query the current ShowSeat statuses for this show
    const currentShowSeats = await tx.showSeat.findMany({
      where: {
        showId,
        seatId: { in: seatIds },
      },
    });

    const now = new Date();
    const unavailableSeats = [];

    for (const ss of currentShowSeats) {
      if (ss.status === 'BOOKED') {
        unavailableSeats.push(ss.seatId);
      } else if (ss.status === 'LOCKED') {
        if (ss.lockedUntil && new Date(ss.lockedUntil) > now && ss.lockedBy !== lockIdentifier) {
          unavailableSeats.push(ss.seatId);
        }
      }
    }

    if (unavailableSeats.length > 0) {
      const error = new Error(`Selected seats [${unavailableSeats.length}] are already booked or held by another guest.`);
      error.statusCode = 409;
      error.conflictSeatIds = unavailableSeats;
      throw error;
    }

    // 4. Atomically lock all requested seats for this show
    for (const seatId of seatIds) {
      await tx.showSeat.update({
        where: {
          showId_seatId: {
            showId,
            seatId,
          },
        },
        data: {
          status: 'LOCKED',
          lockedBy: lockIdentifier,
          lockedUntil,
        },
      });
    }

    // 5. Server-side price calculation
    let totalTicketAmount = 0;
    const bookingSeatsData = [];

    for (const pSeat of physicalSeats) {
      const seatPrice = Math.round(pSeat.price * (show.ticketPriceMultiplier || 1.0));
      totalTicketAmount += seatPrice;
      bookingSeatsData.push({
        seatId: pSeat.id,
        price: seatPrice,
      });
    }

    // 6. Generate unique booking reference
    const bookingReference = `CV3D-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Standard Cinema Fees & GST Calculations (Configurable)
    const convenienceFee = 35.0; // Flat booking convenience fee
    const taxAmount = Math.round((convenienceFee * 0.18) * 100) / 100; // 18% GST on convenience fee
    const grandTotal = Math.round((totalTicketAmount + convenienceFee + taxAmount) * 100) / 100;

    // 7. Create pending Booking record
    const booking = await tx.booking.create({
      data: {
        bookingReference,
        userId: userId || null,
        showId,
        status: 'PENDING',
        totalTicketAmount,
        totalSnackAmount: 0,
        convenienceFee,
        taxAmount,
        grandTotal,
        bookingSeats: {
          create: bookingSeatsData,
        },
      },
      include: {
        bookingSeats: {
          include: {
            seat: true,
          },
        },
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                theatre: true,
              },
            },
          },
        },
      },
    });

    return {
      booking,
      lockIdentifier,
      lockedUntil,
      expiresInSeconds: holdMinutes * 60,
    };
  });

  return result;
};

export const releaseHold = async ({ bookingReference, userId = null, lockIdentifier = null }) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { bookingReference },
      include: {
        bookingSeats: true,
      },
    });

    if (!booking) {
      const error = new Error('Booking reservation not found.');
      error.statusCode = 404;
      throw error;
    }

    if (booking.status !== 'PENDING') {
      const error = new Error(`Cannot release booking with status: ${booking.status}`);
      error.statusCode = 400;
      throw error;
    }

    // Revert seats to AVAILABLE
    const seatIds = booking.bookingSeats.map((bs) => bs.seatId);
    await tx.showSeat.updateMany({
      where: {
        showId: booking.showId,
        seatId: { in: seatIds },
      },
      data: {
        status: 'AVAILABLE',
        lockedBy: null,
        lockedUntil: null,
      },
    });

    // Mark booking as CANCELLED
    const updatedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED' },
    });

    return {
      success: true,
      message: 'Seat hold successfully released.',
      bookingReference,
    };
  });
};

export const updateBookingSnacks = async ({ bookingIdentifier, items = [], userId = null }) => {
  // 1. Locate booking by id or reference
  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { id: bookingIdentifier },
        { bookingReference: bookingIdentifier },
      ],
    },
    include: {
      bookingSeats: true,
      show: true,
    },
  });

  if (!booking) {
    const error = new Error('Booking reservation not found.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Validate booking ownership if authenticated
  if (booking.userId && userId && booking.userId !== userId) {
    const error = new Error('Unauthorized to modify this booking.');
    error.statusCode = 403;
    throw error;
  }

  // 3. Ensure booking is still PENDING
  if (booking.status !== 'PENDING') {
    const error = new Error(`Cannot modify snacks for booking with status: ${booking.status}`);
    error.statusCode = 400;
    throw error;
  }

  // 4. Verify seat hold expiration
  await cleanExpiredLocks(booking.showId);

  const seatIds = booking.bookingSeats.map((bs) => bs.seatId);
  const activeLocks = await prisma.showSeat.findMany({
    where: {
      showId: booking.showId,
      seatId: { in: seatIds },
      status: 'LOCKED',
      lockedUntil: {
        gt: new Date(),
      },
    },
  });

  if (activeLocks.length !== seatIds.length) {
    const error = new Error('Seat reservation hold has expired. Please reselect your seats.');
    error.statusCode = 410;
    throw error;
  }

  // 5. Validate requested snack items against PostgreSQL
  const validatedSnacks = [];
  let totalSnackAmount = 0;

  if (Array.isArray(items) && items.length > 0) {
    const snackIds = items.map((i) => i.snackId);
    const dbSnacks = await prisma.snack.findMany({
      where: {
        id: { in: snackIds },
        isAvailable: true,
      },
    });

    const dbSnackMap = new Map(dbSnacks.map((s) => [s.id, s]));

    for (const item of items) {
      const dbSnack = dbSnackMap.get(item.snackId);
      if (!dbSnack) {
        const error = new Error(`Snack product ${item.snackId} is unavailable or not found.`);
        error.statusCode = 400;
        throw error;
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty < 1 || qty > 20) {
        const error = new Error(`Invalid quantity for snack "${dbSnack.name}". Must be between 1 and 20.`);
        error.statusCode = 400;
        throw error;
      }

      const subtotal = Math.round(dbSnack.price * qty * 100) / 100;
      totalSnackAmount += subtotal;

      validatedSnacks.push({
        snackId: dbSnack.id,
        quantity: qty,
        unitPrice: dbSnack.price,
        subtotal,
      });
    }
  }

  // 6. Recalculate fees and taxes on the server
  const convenienceFee = 35.0; // Flat cinema booking convenience fee
  const convenienceGst = Math.round((convenienceFee * 0.18) * 100) / 100; // 18% GST on convenience fee
  const snackGst = Math.round((totalSnackAmount * 0.05) * 100) / 100; // 5% GST on F&B
  const taxAmount = Math.round((convenienceGst + snackGst) * 100) / 100;
  const grandTotal = Math.round((booking.totalTicketAmount + totalSnackAmount + convenienceFee + taxAmount) * 100) / 100;

  // 7. Atomic transaction to replace BookingSnack records and update Booking
  return await prisma.$transaction(async (tx) => {
    // Delete existing snacks for this booking
    await tx.bookingSnack.deleteMany({
      where: { bookingId: booking.id },
    });

    // Create fresh snack records if any
    if (validatedSnacks.length > 0) {
      await tx.bookingSnack.createMany({
        data: validatedSnacks.map((s) => ({
          bookingId: booking.id,
          snackId: s.snackId,
          quantity: s.quantity,
          unitPrice: s.unitPrice,
          subtotal: s.subtotal,
        })),
      });
    }

    // Update booking totals
    const updatedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        totalSnackAmount,
        convenienceFee,
        taxAmount,
        grandTotal,
      },
      include: {
        bookingSeats: {
          include: { seat: true },
        },
        bookingSnacks: {
          include: { snack: true },
        },
        show: {
          include: {
            movie: true,
            screen: {
              include: { theatre: true },
            },
          },
        },
      },
    });

    return updatedBooking;
  });
};

export const getBookingSummary = async (bookingIdentifier) => {
  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { id: bookingIdentifier },
        { bookingReference: bookingIdentifier },
      ],
    },
    include: {
      bookingSeats: {
        include: { seat: true },
      },
      bookingSnacks: {
        include: { snack: true },
      },
      show: {
        include: {
          movie: true,
          screen: {
            include: { theatre: true },
          },
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!booking) {
    const error = new Error('Booking reservation not found.');
    error.statusCode = 404;
    throw error;
  }

  // Calculate remaining hold time
  let remainingHoldSeconds = 0;
  let isHoldActive = false;

  if (booking.status === 'PENDING') {
    const seatIds = booking.bookingSeats.map((bs) => bs.seatId);
    const showSeats = await prisma.showSeat.findMany({
      where: {
        showId: booking.showId,
        seatId: { in: seatIds },
      },
    });

    const now = new Date();
    const validUntilDates = showSeats
      .filter((s) => s.status === 'LOCKED' && s.lockedUntil && new Date(s.lockedUntil) > now)
      .map((s) => new Date(s.lockedUntil));

    if (validUntilDates.length === seatIds.length) {
      const minLockedUntil = new Date(Math.min(...validUntilDates));
      remainingHoldSeconds = Math.max(0, Math.floor((minLockedUntil.getTime() - now.getTime()) / 1000));
      isHoldActive = remainingHoldSeconds > 0;
    }
  }

  return {
    booking,
    isHoldActive,
    remainingHoldSeconds,
  };
};

export const getBookingByReference = async (bookingReference, requestingUserId = null) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingReference },
    include: {
      bookingSeats: {
        include: {
          seat: true,
        },
      },
      bookingSnacks: {
        include: {
          snack: true,
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
      show: {
        include: {
          movie: true,
          screen: {
            include: {
              theatre: true,
            },
          },
        },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  return booking;
};

export const getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      bookingSeats: {
        include: {
          seat: true,
        },
      },
      bookingSnacks: {
        include: {
          snack: true,
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
      show: {
        include: {
          movie: true,
          screen: {
            include: {
              theatre: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
