import mongoose from 'mongoose';
import Restaurant from './Restaurant.js';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true }, // denormalised for quick display
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

// One review per user per restaurant.
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true });

/**
 * Recalculate a restaurant's average rating and review count.
 * Called from a static so it can run after save and after remove.
 */
reviewSchema.statics.recalcRestaurantRating = async function (restaurantId) {
  const stats = await this.aggregate([
    { $match: { restaurant: restaurantId } },
    { $group: { _id: '$restaurant', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: Math.round(avg * 10) / 10,
    numReviews: count,
  });
};

reviewSchema.post('save', function () {
  this.constructor.recalcRestaurantRating(this.restaurant);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) doc.constructor.recalcRestaurantRating(doc.restaurant);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
