import { 
  holdSeats, 
  releaseHold, 
  getBookingByReference, 
  getUserBookings,
  updateBookingSnacks,
  getBookingSummary,
} from '../services/bookingService.js';

export const createSeatHold = async (req, res, next) => {
  try {
    const { showId, seatIds, guestEmail, guestName } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!showId || !seatIds) {
      return res.status(400).json({
        success: false,
        message: 'Show ID and an array of seat IDs are required.',
      });
    }

    const holdResult = await holdSeats({
      showId,
      seatIds,
      userId,
      guestEmail,
      guestName,
    });

    res.status(201).json({
      success: true,
      message: 'Seats held successfully. Please complete payment within the reservation window.',
      data: {
        bookingReference: holdResult.booking.bookingReference,
        bookingId: holdResult.booking.id,
        showId: holdResult.booking.showId,
        status: holdResult.booking.status,
        totalTicketAmount: holdResult.booking.totalTicketAmount,
        seatsCount: holdResult.booking.bookingSeats.length,
        lockedUntil: holdResult.lockedUntil,
        expiresInSeconds: holdResult.expiresInSeconds,
        seats: holdResult.booking.bookingSeats.map((bs) => ({
          seatId: bs.seatId,
          row: bs.seat.row,
          seatNumber: bs.seat.seatNumber,
          category: bs.seat.category,
          price: bs.price,
        })),
        movie: {
          id: holdResult.booking.show.movie.id,
          title: holdResult.booking.show.movie.title,
          poster: holdResult.booking.show.movie.poster,
        },
        theatre: {
          name: holdResult.booking.show.screen.theatre.name,
          city: holdResult.booking.show.screen.theatre.city,
          screenName: holdResult.booking.show.screen.name,
        },
        showDetails: {
          showDate: holdResult.booking.show.showDate,
          startTime: holdResult.booking.show.startTime,
        },
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        conflictSeatIds: error.conflictSeatIds || [],
      });
    }
    next(error);
  }
};

export const releaseSeatHold = async (req, res, next) => {
  try {
    const { bookingReference } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!bookingReference) {
      return res.status(400).json({
        success: false,
        message: 'Booking reference is required to release hold.',
      });
    }

    const result = await releaseHold({
      bookingReference,
      userId,
    });

    res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const getBookingDetails = async (req, res, next) => {
  try {
    const { id: referenceOrId } = req.params;
    const userId = req.user ? req.user.id : null;

    const booking = await getBookingByReference(referenceOrId, userId);

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to view booking history.',
      });
    }

    const bookings = await getUserBookings(req.user.id);

    res.status(200).json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSnacks = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { items } = req.body;
    const userId = req.user ? req.user.id : null;

    const updatedBooking = await updateBookingSnacks({
      bookingIdentifier: bookingId,
      items: items || [],
      userId,
    });

    res.status(200).json({
      success: true,
      message: 'Snacks order updated successfully.',
      data: { booking: updatedBooking },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const summary = await getBookingSummary(bookingId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};
