import express from 'express';
import {
  createSeatHold,
  releaseSeatHold,
  getBookingDetails,
  getMyBookings,
  updateSnacks,
  getSummary,
} from '../controllers/bookingController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/hold', optionalAuth, createSeatHold);
router.post('/release', optionalAuth, releaseSeatHold);
router.get('/user/me', protect, getMyBookings);
router.get('/:bookingId/summary', optionalAuth, getSummary);
router.post('/:bookingId/snacks', optionalAuth, updateSnacks);
router.get('/:id', optionalAuth, getBookingDetails);

export default router;
