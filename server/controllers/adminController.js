import asyncHandler from 'express-async-handler';
import Restaurant from '../models/Restaurant.js';
import Dish from '../models/Dish.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

// @route  GET /api/admin/analytics  (admin)
// Aggregated counts and simple leaderboards for the dashboard.
export const getAnalytics = asyncHandler(async (req, res) => {
  const [restaurants, dishes, reviews, users, topRestaurants, topDishes, byCity] =
    await Promise.all([
      Restaurant.countDocuments(),
      Dish.countDocuments(),
      Review.countDocuments(),
      User.countDocuments(),
      Restaurant.find().sort({ rating: -1 }).limit(5).select('name rating city').lean(),
      Dish.find().sort({ popularity: -1 }).limit(5).select('name popularity recommends').lean(),
      Restaurant.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
    ]);

  res.json({
    success: true,
    totals: { restaurants, dishes, reviews, users },
    topRestaurants,
    topDishes,
    restaurantsByCity: byCity,
  });
});
