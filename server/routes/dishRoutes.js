import { Router } from 'express';
import { body } from 'express-validator';
import {
  getDishes,
  getTrendingDishes,
  getRecommendations,
  likeDish,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router.get('/trending', getTrendingDishes);
router.get('/recommendations', getRecommendations);

router
  .route('/')
  .get(getDishes)
  .post(
    protect,
    admin,
    [
      body('name').trim().notEmpty().withMessage('Dish name is required'),
      body('restaurant').notEmpty().withMessage('restaurant id is required'),
      body('price').isNumeric().withMessage('price must be a number'),
    ],
    validate,
    createDish
  );

router.post('/:id/like', protect, likeDish);

router.route('/:id').put(protect, admin, updateDish).delete(protect, admin, deleteDish);

export default router;
