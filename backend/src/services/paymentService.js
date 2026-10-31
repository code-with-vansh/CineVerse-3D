import crypto from 'crypto';
import prisma from '../config/database.js';
import { cleanExpiredLocks } from './seatService.js';

export const initiatePayment = async ({ bookingIdentifier, paymentMethod = 'UPI', userId = null }) => {
  const allowedMethods = ['UPI', 'CARD', 'WALLET'];
  const normalizedMethod = paymentMethod.toUpperCase();

  if (!allowedMethods.includes(normalizedMethod)) {
    const error = new Error(`Invalid payment method: ${paymentMethod}. Allowed: UPI, CARD, WALLET`);
    error.statusCode = 400;
    throw error;
  }

  // 1. Locate booking
  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { id: bookingIdentifier },
        { bookingReference: bookingIdentifier },
      ],
    },
    include: {
      bookingSeats: { include: { seat: true } },
      bookingSnacks: { include: { snack: true } },
      show: true,
    },
  });

  if (!booking) {
    const error = new Error('Booking reservation not found.');
    error.statusCode = 404;
    throw error;
  }

  if (booking.userId && userId && booking.userId !== userId) {
    const error = new Error('Unauthorized to pay for this booking.');
    error.statusCode = 403;
    throw error;
  }

  if (booking.status === 'CONFIRMED') {
    const error = new Error('This booking has already been confirmed and paid for.');
    error.statusCode = 400;
    throw error;
  }

  if (booking.status !== 'PENDING') {
    const error = new Error(`Cannot initiate payment for booking with status: ${booking.status}`);
    error.statusCode = 400;
    throw error;
  }

  // 2. Ensure seat locks are still valid
  await cleanExpiredLocks(booking.showId);

  const seatIds = booking.bookingSeats.map((bs) => bs.seatId);
  const now = new Date();
  const activeLocks = await prisma.showSeat.findMany({
    where: {
      showId: booking.showId,
      seatId: { in: seatIds },
      status: 'LOCKED',
      lockedUntil: {
        gt: now,
      },
    },
  });

  if (activeLocks.length !== seatIds.length) {
    const error = new Error('Your 5-minute seat reservation hold has expired. Please reselect your seats.');
    error.statusCode = 410;
    throw error;
  }

  // 3. Ensure amounts are accurately calculated
  let grandTotal = booking.grandTotal;
  if (!grandTotal || grandTotal <= 0) {
    const convenienceFee = 35.0;
    const convenienceGst = 6.30;
    const snackGst = Math.round((booking.totalSnackAmount * 0.05) * 100) / 100;
    const taxAmount = Math.round((convenienceGst + snackGst) * 100) / 100;
    grandTotal = Math.round((booking.totalTicketAmount + booking.totalSnackAmount + convenienceFee + taxAmount) * 100) / 100;

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        convenienceFee,
        taxAmount,
        grandTotal,
      },
    });
  }

  // 4. Create unique transaction reference
  const transactionReference = `TXN-CV3D-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // 5. Create Payment record in PENDING state
  const payment = await prisma.payment.create({
    data: {
      transactionReference,
      bookingId: booking.id,
      amount: grandTotal,
      paymentMethod: normalizedMethod,
      status: 'PENDING',
    },
  });

  return {
    payment,
    bookingReference: booking.bookingReference,
    amount: grandTotal,
    payableBreakdown: {
      tickets: booking.totalTicketAmount,
      snacks: booking.totalSnackAmount,
      convenienceFee: booking.convenienceFee,
      tax: booking.taxAmount,
      grandTotal,
    },
    demoNotice: 'DEMO PAYMENT — NO REAL MONEY WILL BE CHARGED.',
  };
};

export const simulatePaymentResult = async ({
  paymentId,
  outcome = 'SUCCESS',
  paymentMethod = null,
}) => {
  const normalizedOutcome = outcome.toUpperCase();
  if (!['SUCCESS', 'FAILED'].includes(normalizedOutcome)) {
    const error = new Error('Outcome must be either SUCCESS or FAILED.');
    error.statusCode = 400;
    throw error;
  }

  // 1. Fetch payment and associated booking
  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        { id: paymentId },
        { transactionReference: paymentId },
      ],
    },
    include: {
      booking: {
        include: {
          bookingSeats: { include: { seat: true } },
          bookingSnacks: { include: { snack: true } },
          show: {
            include: {
              movie: true,
              screen: { include: { theatre: true } },
            },
          },
        },
      },
    },
  });

  if (!payment) {
    const error = new Error('Payment transaction not found.');
    error.statusCode = 404;
    throw error;
  }

  const { booking } = payment;

  // 2. IDEMPOTENCY CHECK: If already confirmed, return success without duplicate operations
  if (payment.status === 'SUCCESS' && booking.status === 'CONFIRMED') {
    return {
      success: true,
      isIdempotent: true,
      message: 'Payment already processed and booking confirmed.',
      payment,
      booking,
      ticketCode: booking.ticketCode,
    };
  }

  // 3. Handle SIMULATED FAILURE
  if (normalizedOutcome === 'FAILED') {
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
        ...(paymentMethod ? { paymentMethod: paymentMethod.toUpperCase() } : {}),
      },
    });

    return {
      success: false,
      message: 'Simulated payment was declined or failed. You may retry while your seat hold is valid.',
      payment: updatedPayment,
      bookingReference: booking.bookingReference,
      canRetry: booking.status === 'PENDING',
    };
  }

  // 4. Handle SIMULATED SUCCESS
  // A. Check that booking is PENDING
  if (booking.status !== 'PENDING') {
    const error = new Error(`Cannot confirm booking with current status: ${booking.status}`);
    error.statusCode = 400;
    throw error;
  }

  // B. Clean expired locks and check that seat holds are still unexpired
  await cleanExpiredLocks(booking.showId);

  const seatIds = booking.bookingSeats.map((bs) => bs.seatId);
  const now = new Date();
  const validLocks = await prisma.showSeat.findMany({
    where: {
      showId: booking.showId,
      seatId: { in: seatIds },
      status: 'LOCKED',
      lockedUntil: {
        gt: now,
      },
    },
  });

  if (validLocks.length !== seatIds.length) {
    // Mark payment as FAILED because the reservation hold expired before payment was completed
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });

    const error = new Error('Your seat reservation hold expired before payment completed. No charges applied.');
    error.statusCode = 410;
    throw error;
  }

  // C. Execute atomic transaction to confirm booking and lock seats as BOOKED permanently
  const result = await prisma.$transaction(async (tx) => {
    // 1. Mark payment as SUCCESS
    const confirmedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        ...(paymentMethod ? { paymentMethod: paymentMethod.toUpperCase() } : {}),
      },
    });

    // 2. Generate unique digital ticket code
    const ticketCode = `CV3D-TKT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // 3. Update Booking to CONFIRMED
    const confirmedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED',
        ticketCode,
      },
      include: {
        bookingSeats: { include: { seat: true } },
        bookingSnacks: { include: { snack: true } },
        show: {
          include: {
            movie: true,
            screen: { include: { theatre: true } },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // 4. Update ShowSeat records to BOOKED status
    await tx.showSeat.updateMany({
      where: {
        showId: booking.showId,
        seatId: { in: seatIds },
      },
      data: {
        status: 'BOOKED',
        lockedBy: null,
        lockedUntil: null,
      },
    });

    return {
      payment: confirmedPayment,
      booking: confirmedBooking,
      ticketCode,
    };
  });

  return {
    success: true,
    message: 'Simulated payment successful! Your movie tickets are confirmed.',
    payment: result.payment,
    booking: result.booking,
    ticketCode: result.ticketCode,
  };
};

export const getPaymentById = async (paymentId) => {
  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        { id: paymentId },
        { transactionReference: paymentId },
      ],
    },
    include: {
      booking: {
        include: {
          bookingSeats: { include: { seat: true } },
          bookingSnacks: { include: { snack: true } },
          show: {
            include: {
              movie: true,
              screen: { include: { theatre: true } },
            },
          },
        },
      },
    },
  });

  if (!payment) {
    const error = new Error('Payment transaction not found.');
    error.statusCode = 404;
    throw error;
  }

  return payment;
};

export const getBookingPayment = async (bookingId) => {
  const payment = await prisma.payment.findFirst({
    where: { bookingId },
    orderBy: { createdAt: 'desc' },
  });

  return payment;
};
