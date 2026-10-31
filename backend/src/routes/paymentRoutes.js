import express from 'express';
import {
  handleInitiatePayment,
  handleSimulateResult,
  handleGetPayment,
  handleGetBookingPayment,
} from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initiate', optionalAuth, handleInitiatePayment);
router.post('/:paymentId/simulate-result', handleSimulateResult);
router.get('/:paymentId', handleGetPayment);
router.get('/booking/:bookingId', handleGetBookingPayment);

export default router;
