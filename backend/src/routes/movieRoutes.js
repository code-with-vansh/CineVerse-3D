import express from 'express';
import {
  getAllMovies,
  getMovieById,
  getMoviesByLanguage,
  searchMovies,
  getNowShowing,
  getUpcoming,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { getTheatresByMovie } from '../controllers/theatreController.js';
import { getShowsByMovie } from '../controllers/showController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/now-showing', getNowShowing);
router.get('/upcoming', getUpcoming);
router.get('/search', searchMovies);
router.get('/language/:language', getMoviesByLanguage);
router.get('/:movieId/theatres', getTheatresByMovie);
router.get('/:movieId/shows', getShowsByMovie);
router.get('/:id', getMovieById);

// Admin endpoints
router.post('/', protect, requireAdmin, createMovie);
router.put('/:id', protect, requireAdmin, updateMovie);
router.delete('/:id', protect, requireAdmin, deleteMovie);

export default router;
