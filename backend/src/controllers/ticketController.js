import prisma from '../config/database.js';

// @desc    Verify digital ticket code
// @route   GET /api/tickets/:ticketCode
// @access  Public
export const verifyTicket = async (req, res, next) => {
  try {
    const { ticketCode } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { ticketCode },
          { bookingReference: ticketCode },
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
          where: { status: 'SUCCESS' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        isValid: false,
        message: 'Invalid ticket code. No matching cinema ticket was found.',
      });
    }

    if (booking.status !== 'CONFIRMED') {
      return res.status(200).json({
        success: true,
        isValid: false,
        status: booking.status,
        message: `This ticket is not active. Status: ${booking.status}.`,
        bookingReference: booking.bookingReference,
      });
    }

    // Return sanitized public verification details
    res.status(200).json({
      success: true,
      isValid: true,
      data: {
        ticketCode: booking.ticketCode,
        bookingReference: booking.bookingReference,
        status: booking.status,
        issuedAt: booking.updatedAt,
        movie: {
          id: booking.show.movie.id,
          title: booking.show.movie.title,
          poster: booking.show.movie.poster,
          language: booking.show.movie.language,
          duration: booking.show.movie.duration,
        },
        theatre: {
          name: booking.show.screen.theatre.name,
          city: booking.show.screen.theatre.city,
          address: booking.show.screen.theatre.address,
          screenName: booking.show.screen.name,
          screenType: booking.show.screen.screenType,
        },
        show: {
          showDate: booking.show.showDate,
          startTime: booking.show.startTime,
        },
        seats: booking.bookingSeats.map((bs) => ({
          label: `${bs.seat.row}${bs.seat.seatNumber}`,
          row: bs.seat.row,
          number: bs.seat.seatNumber,
          category: bs.seat.category,
        })),
        snacks: booking.bookingSnacks.map((bs) => ({
          name: bs.snack.name,
          quantity: bs.quantity,
        })),
        payment: {
          amount: booking.grandTotal,
          paymentMethod: booking.payments[0]?.paymentMethod || 'DEMO',
          transactionReference: booking.payments[0]?.transactionReference,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
