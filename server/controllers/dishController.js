import asyncHandler from 'express-async-handler';
import Dish from '../models/Dish.js';

// @route  GET /api/dishes  — supports ?q= ?category= ?signature=true ?mustTry=true
export const getDishes = asyncHandler(async (req, res) => {
  const { q, category, signature, mustTry, limit = 24 } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (signature === 'true') filter.isSignature = true;
  if (mustTry === 'true') filter.isMustTry = true;

  const dishes = await Dish.find(filter)
    .sort({ popularity: -1 })
    .limit(Math.min(60, Number(limit)))
    .populate('restaurant', 'name slug city area coverImage rating')
    .lean();

  res.json({ success: true, count: dishes.length, dishes });
});

// @route  GET /api/dishes/trending — top signature dishes by popularity
export const getTrendingDishes = asyncHandler(async (req, res) => {
  const dishes = await Dish.find({ isSignature: true })
    .sort({ popularity: -1, recommends: -1 })
    .limit(12)
    .populate('restaurant', 'name slug city coverImage rating')
    .lean();
  res.json({ success: true, dishes });
});

// @route  GET /api/dishes/recommendations — lightweight "AI" recommender
// Scores dishes by popularity + recommends + likes, optionally biased by category.
export const getRecommendations = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const match = { isSignature: true };
  if (category) match.category = category;

  const dishes = await Dish.aggregate([
    { $match: match },
    {
      $addFields: {
        score: {
          $add: [
            '$popularity',
            { $multiply: ['$recommends', 0.05] },
            { $multiply: ['$likes', 0.1] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 8 },
  ]);

  await Dish.populate(dishes, { path: 'restaurant', select: 'name slug city coverImage rating' });
  res.json({ success: true, dishes });
});

// @route  POST /api/dishes/:id/like  (protected)
export const likeDish = asyncHandler(async (req, res) => {
  const user = req.user;
  const already = user.likedDishes.some((id) => id.equals(req.params.id));

  const dish = await Dish.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: already ? -1 : 1 } },
    { new: true }
  );
  if (!dish) {
    res.status(404);
    throw new Error('Dish not found');
  }

  if (already) {
    user.likedDishes = user.likedDishes.filter((id) => !id.equals(req.params.id));
  } else {
    user.likedDishes.push(dish._id);
  }
  await user.save();

  res.json({ success: true, liked: !already, likes: dish.likes });
});

// ---- Admin CRUD ----

// @route  POST /api/dishes  (admin)
export const createDish = asyncHandler(async (req, res) => {
  const dish = await Dish.create(req.body);
  res.status(201).json({ success: true, dish });
});

// @route  PUT /api/dishes/:id  (admin)
export const updateDish = asyncHandler(async (req, res) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!dish) {
    res.status(404);
    throw new Error('Dish not found');
  }
  res.json({ success: true, dish });
});

// @route  DELETE /api/dishes/:id  (admin)
export const deleteDish = asyncHandler(async (req, res) => {
  const dish = await Dish.findByIdAndDelete(req.params.id);
  if (!dish) {
    res.status(404);
    throw new Error('Dish not found');
  }
  res.json({ success: true, message: 'Dish removed' });
});
