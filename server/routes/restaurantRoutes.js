import { Router } from 'express';
import { body } from 'express-validator';
import {
  getRestaurants,
  getCollections,
  getNearby,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// Static routes must be declared before the dynamic :id route.
router.get('/collections', getCollections);
router.get('/nearby', getNearby);

router
  .route('/')
  .get(getRestaurants)
  .post(
    protect,
    admin,
    [
      body('name').trim().notEmpty().withMessage('Name is required'),
      body('address').trim().notEmpty().withMessage('Address is required'),
      body('city').trim().notEmpty().withMessage('City is required'),
    ],
    validate,
    createRestaurant
  );

router
  .route('/:id')
  .get(getRestaurantById)
  .put(protect, admin, updateRestaurant)
  .delete(protect, admin, deleteRestaurant);

export default router;
