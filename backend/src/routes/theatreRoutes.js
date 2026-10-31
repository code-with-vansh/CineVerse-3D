import express from 'express';
import {
  getAllTheatres,
  getTheatreById,
  getTheatresByCity,
  getTheatresByMovie,
} from '../controllers/theatreController.js';
import { getShowsByTheatre } from '../controllers/showController.js';

const router = express.Router();

router.get('/', getAllTheatres);
router.get('/city/:city', getTheatresByCity);
router.get('/movie/:movieId', getTheatresByMovie);
router.get('/:theatreId/shows', getShowsByTheatre);
router.get('/:id', getTheatreById);

export default router;
