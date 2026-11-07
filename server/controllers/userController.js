import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @route  GET /api/users/favourites  (protected)
export const getFavourites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favourites');
  res.json({ success: true, favourites: user.favourites });
});

// @route  POST /api/users/favourites/:restaurantId  (protected) — toggle
export const toggleFavourite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const id = req.params.restaurantId;
  const already = user.favourites.some((f) => f.equals(id));

  if (already) {
    user.favourites = user.favourites.filter((f) => !f.equals(id));
  } else {
    user.favourites.push(id);
  }
  await user.save();
  res.json({ success: true, saved: !already, favourites: user.favourites });
});

// @route  GET /api/users/recent  (protected)
export const getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('recentlyViewed');
  res.json({ success: true, recentlyViewed: user.recentlyViewed });
});

// @route  POST /api/users/recent/:restaurantId  (protected)
// Pushes to the front, de-dupes, keeps the 10 most recent.
export const addRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const id = req.params.restaurantId;
  user.recentlyViewed = [id, ...user.recentlyViewed.filter((r) => !r.equals(id))].slice(0, 10);
  await user.save();
  res.json({ success: true, recentlyViewed: user.recentlyViewed });
});
