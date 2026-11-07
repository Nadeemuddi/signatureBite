import asyncHandler from 'express-async-handler';
import Restaurant from '../models/Restaurant.js';
import Dish from '../models/Dish.js';
import Review from '../models/Review.js';

/**
 * Build a Mongoose filter object from query params.
 * Supports: q (text search), city, area, cuisine, category, price,
 * veg, nonVeg, minRating, openNow, delivery.
 */
const buildFilter = (query) => {
  const filter = {};
  const { q, city, area, cuisine, price, veg, nonVeg, minRating, openNow, delivery } = query;

  if (q) filter.$text = { $search: q };
  if (city) filter.city = new RegExp(`^${city}$`, 'i');
  if (area) filter.area = new RegExp(area, 'i');
  if (cuisine) filter.cuisine = { $in: [new RegExp(cuisine, 'i')] };
  if (price) filter.priceRange = price;
  if (veg === 'true') filter.isVeg = true;
  if (nonVeg === 'true') filter.servesNonVeg = true;
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (openNow === 'true') filter.isOpenNow = true;
  if (delivery === 'true') filter.delivery = true;

  return filter;
};

// @route  GET /api/restaurants  — list with filtering, sorting, pagination
export const getRestaurants = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 12);
  const skip = (page - 1) * limit;

  const filter = buildFilter(req.query);

  // Sorting
  const sortMap = {
    rating: { rating: -1 },
    priceLow: { costForTwo: 1 },
    priceHigh: { costForTwo: -1 },
    newest: { createdAt: -1 },
  };
  const sort = sortMap[req.query.sort] || { rating: -1 };

  const [items, total] = await Promise.all([
    Restaurant.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Restaurant.countDocuments(filter),
  ]);

  res.json({
    success: true,
    page,
    pages: Math.ceil(total / limit),
    total,
    count: items.length,
    restaurants: items,
  });
});

// @route  GET /api/restaurants/collections — homepage sections in one call
export const getCollections = asyncHandler(async (req, res) => {
  const [trending, hiddenGems, topRated, newest] = await Promise.all([
    Restaurant.find({ trending: true }).limit(8).lean(),
    Restaurant.find({ hiddenGem: true }).limit(8).lean(),
    Restaurant.find({}).sort({ rating: -1 }).limit(8).lean(),
    Restaurant.find({}).sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  res.json({ success: true, trending, hiddenGems, topRated, newest });
});

// @route  GET /api/restaurants/nearby?lng=&lat=&radius=(km)
export const getNearby = asyncHandler(async (req, res) => {
  const { lng, lat, radius = 5 } = req.query;
  if (lng === undefined || lat === undefined) {
    res.status(400);
    throw new Error('lng and lat query params are required');
  }
  const restaurants = await Restaurant.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius) * 1000,
      },
    },
  })
    .limit(20)
    .lean();
  res.json({ success: true, count: restaurants.length, restaurants });
});

// @route  GET /api/restaurants/:id  — details + dishes + reviews
export const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).lean();
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const [dishes, reviews] = await Promise.all([
    Dish.find({ restaurant: restaurant._id }).sort({ isSignature: -1, popularity: -1 }).lean(),
    Review.find({ restaurant: restaurant._id }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  res.json({
    success: true,
    restaurant,
    signatureDishes: dishes.filter((d) => d.isSignature),
    popularDishes: dishes.filter((d) => !d.isSignature),
    reviews,
  });
});

// ---- Admin CRUD ----

// @route  POST /api/restaurants  (admin)
export const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({ success: true, restaurant });
});

// @route  PUT /api/restaurants/:id  (admin)
export const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }
  res.json({ success: true, restaurant });
});

// @route  DELETE /api/restaurants/:id  (admin)
export const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }
  await Promise.all([
    Dish.deleteMany({ restaurant: restaurant._id }),
    Review.deleteMany({ restaurant: restaurant._id }),
  ]);
  res.json({ success: true, message: 'Restaurant and related data removed' });
});
