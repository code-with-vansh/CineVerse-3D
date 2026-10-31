import express from 'express';
import { verifyTicket } from '../controllers/ticketController.js';

const router = express.Router();

router.get('/:ticketCode', verifyTicket);

export default router;
