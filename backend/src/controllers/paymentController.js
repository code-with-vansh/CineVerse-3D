import {
  initiatePayment,
  simulatePaymentResult,
  getPaymentById,
  getBookingPayment,
} from '../services/paymentService.js';

// @desc    Initiate payment for a booking
// @route   POST /api/payments/initiate
// @access  Public / Optional Auth
export const handleInitiatePayment = async (req, res, next) => {
  try {
    const { bookingId, bookingReference, paymentMethod } = req.body;
    const bookingIdentifier = bookingId || bookingReference;
    const userId = req.user ? req.user.id : null;

    if (!bookingIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID or Booking Reference is required to initiate payment.',
      });
    }

    const result = await initiatePayment({
      bookingIdentifier,
      paymentMethod: paymentMethod || 'UPI',
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Payment transaction initialized in demo mode.',
      data: result,
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

// @desc    Simulate payment result (SUCCESS or FAILED)
// @route   POST /api/payments/:paymentId/simulate-result
// @access  Public
export const handleSimulateResult = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { outcome, paymentMethod } = req.body;

    const result = await simulatePaymentResult({
      paymentId,
      outcome: outcome || 'SUCCESS',
      paymentMethod,
    });

    const statusCode = result.success ? 200 : 400;

    res.status(statusCode).json({
      ...result,
      demoNotice: 'DEMO PAYMENT SIMULATION — NO REAL MONEY CHARGED',
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

// @desc    Get payment by ID or transactionReference
// @route   GET /api/payments/:paymentId
// @access  Public
export const handleGetPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await getPaymentById(paymentId);

    res.status(200).json({
      success: true,
      data: { payment },
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

// @desc    Get payment associated with a booking
// @route   GET /api/bookings/:bookingId/payment
// @access  Public
export const handleGetBookingPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const payment = await getBookingPayment(bookingId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'No payment transaction found for this booking.',
      });
    }

    res.status(200).json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};
