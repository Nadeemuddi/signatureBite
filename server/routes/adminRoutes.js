import { Router } from 'express';
import { getAnalytics } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/analytics', protect, admin, getAnalytics);

export default router;
