import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';

// @route  GET /api/reviews/restaurant/:restaurantId
export const getRestaurantReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ restaurant: req.params.restaurantId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, count: reviews.length, reviews });
});

// @route  POST /api/reviews/restaurant/:restaurantId  (protected)
// Upserts — a user editing their review updates the existing one.
export const upsertReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const filter = { user: req.user._id, restaurant: req.params.restaurantId };

  let review = await Review.findOne(filter);
  if (review) {
    review.rating = rating;
    review.comment = comment;
    await review.save();
    return res.json({ success: true, review, updated: true });
  }

  review = await Review.create({
    ...filter,
    userName: req.user.name,
    rating,
    comment,
  });
  res.status(201).json({ success: true, review });
});

// @route  DELETE /api/reviews/:id  (protected — owner or admin)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  const isOwner = review.user.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }
  await Review.findByIdAndDelete(review._id); // triggers rating recalculation
  res.json({ success: true, message: 'Review removed' });
});
