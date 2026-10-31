import express from 'express';
import {
  getShows,
  getShowById,
  getShowsByMovie,
  getShowsByTheatre,
} from '../controllers/showController.js';
import { getShowSeats } from '../controllers/seatController.js';

const router = express.Router();

router.get('/', getShows);
router.get('/movie/:movieId', getShowsByMovie);
router.get('/theatre/:theatreId', getShowsByTheatre);
router.get('/:showId/seats', getShowSeats);
router.get('/:id', getShowById);

export default router;
