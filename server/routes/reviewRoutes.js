import { Router } from 'express';
import { body } from 'express-validator';
import {
  getRestaurantReviews,
  upsertReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router
  .route('/restaurant/:restaurantId')
  .get(getRestaurantReviews)
  .post(
    protect,
    [
      body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
      body('comment').optional().isString(),
    ],
    validate,
    upsertReview
  );

router.delete('/:id', protect, deleteReview);

export default router;
