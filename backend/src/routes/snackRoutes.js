import express from 'express';
import {
  getSnacks,
  getSnackById,
  getSnacksByCategory,
  createSnack,
  updateSnack,
  deleteSnack,
} from '../controllers/snackController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSnacks)
  .post(protect, requireAdmin, createSnack);

router.route('/category/:category')
  .get(getSnacksByCategory);

router.route('/:id')
  .get(getSnackById)
  .put(protect, requireAdmin, updateSnack)
  .delete(protect, requireAdmin, deleteSnack);

export default router;
