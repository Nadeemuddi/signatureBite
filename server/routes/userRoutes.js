import { Router } from 'express';
import {
  getFavourites,
  toggleFavourite,
  getRecentlyViewed,
  addRecentlyViewed,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // all user routes require auth

router.get('/favourites', getFavourites);
router.post('/favourites/:restaurantId', toggleFavourite);
router.get('/recent', getRecentlyViewed);
router.post('/recent/:restaurantId', addRecentlyViewed);

export default router;
