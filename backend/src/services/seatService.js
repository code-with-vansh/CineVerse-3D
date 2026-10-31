import prisma from '../config/database.js';

export const cleanExpiredLocks = async (showId = null) => {
  const now = new Date();
  const whereClause = {
    status: 'LOCKED',
    lockedUntil: {
      lt: now,
    },
  };

  if (showId) {
    whereClause.showId = showId;
  }

  // Find expired locks to also mark corresponding pending bookings as EXPIRED
  const expiredShowSeats = await prisma.showSeat.findMany({
    where: whereClause,
    select: { showId: true, seatId: true },
  });

  if (expiredShowSeats.length > 0) {
    await prisma.showSeat.updateMany({
      where: whereClause,
      data: {
        status: 'AVAILABLE',
        lockedBy: null,
        lockedUntil: null,
      },
    });

    // Mark pending bookings older than hold duration as EXPIRED
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await prisma.booking.updateMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: fiveMinutesAgo,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });
  }
};

export const getSeatsForShow = async (showId) => {
  // First, eagerly revert any expired seat locks for this show
  await cleanExpiredLocks(showId);

  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: {
      movie: {
        select: { id: true, title: true, poster: true, banner: true, duration: true },
      },
      screen: {
        include: {
          theatre: {
            select: { id: true, name: true, city: true, address: true },
          },
        },
      },
    },
  });

  if (!show) {
    throw new Error('Show not found');
  }

  const showSeats = await prisma.showSeat.findMany({
    where: { showId },
    include: {
      seat: true,
    },
    orderBy: [
      { seat: { row: 'asc' } },
      { seat: { seatNumber: 'asc' } },
    ],
  });

  const formattedSeats = showSeats.map((item) => {
    // If lock expired in between, treat as AVAILABLE
    let effectiveStatus = item.status;
    if (item.status === 'LOCKED' && item.lockedUntil && new Date(item.lockedUntil) < new Date()) {
      effectiveStatus = 'AVAILABLE';
    }

    const calculatedPrice = Math.round(item.seat.price * (show.ticketPriceMultiplier || 1.0));

    return {
      id: item.seatId,
      showSeatId: item.id,
      row: item.seat.row,
      seatNumber: item.seat.seatNumber,
      category: item.seat.category,
      price: calculatedPrice,
      status: effectiveStatus,
      lockedBy: effectiveStatus === 'LOCKED' ? item.lockedBy : null,
    };
  });

  return {
    showId: show.id,
    showDate: show.showDate,
    startTime: show.startTime,
    language: show.language,
    movie: show.movie,
    screen: {
      id: show.screen.id,
      name: show.screen.name,
      screenNumber: show.screen.screenNumber,
      screenType: show.screen.screenType,
      theatre: show.screen.theatre,
    },
    totalSeats: formattedSeats.length,
    availableSeatsCount: formattedSeats.filter((s) => s.status === 'AVAILABLE').length,
    seats: formattedSeats,
  };
};
