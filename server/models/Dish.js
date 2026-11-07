import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },

    category: {
      type: String,
      enum: ['Biryani', 'Pizza', 'South Indian', 'Chinese', 'Desserts', 'Drinks', 'North Indian', 'Other'],
      default: 'Other',
      index: true,
    },
    isVeg: { type: Boolean, default: false },

    // A dish the restaurant is famous for.
    isSignature: { type: Boolean, default: false },
    isMustTry: { type: Boolean, default: false },

    popularity: { type: Number, default: 0, min: 0, max: 100 }, // 0-100 score
    recommends: { type: Number, default: 0 }, // number of people who recommend it
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

dishSchema.index({ name: 'text', description: 'text' });

const Dish = mongoose.model('Dish', dishSchema);
export default Dish;
