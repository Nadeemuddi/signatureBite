import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },

    address: { type: String, required: true },
    area: { type: String, default: '', index: true },
    city: { type: String, required: true, index: true },

    cuisine: [{ type: String, index: true }], // e.g. ['Biryani', 'North Indian']
    priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
    costForTwo: { type: Number, default: 500 },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },

    openingHours: { type: String, default: '11:00 AM - 11:00 PM' },
    isOpenNow: { type: Boolean, default: true },
    phone: { type: String, default: '' },

    images: [{ type: String }], // gallery
    coverImage: { type: String, default: '' },

    // Service options
    delivery: { type: Boolean, default: true },
    dineIn: { type: Boolean, default: true },
    isVeg: { type: Boolean, default: false }, // pure-veg flag
    servesNonVeg: { type: Boolean, default: true },

    // GeoJSON point for "nearby" queries
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },

    // Curation flags for homepage sections
    trending: { type: Boolean, default: false },
    hiddenGem: { type: Boolean, default: false },
    topRated: { type: Boolean, default: false },

    // The dish this place is famous for (denormalised for card display)
    signatureDishName: { type: String, default: '' },
  },
  { timestamps: true }
);

restaurantSchema.index({ location: '2dsphere' });
// Text index powers keyword search across name / description / cuisine / area / city.
restaurantSchema.index({
  name: 'text',
  description: 'text',
  cuisine: 'text',
  area: 'text',
  city: 'text',
  signatureDishName: 'text',
});

// Auto-generate a URL slug from the name.
restaurantSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.random().toString(36).slice(2, 6);
  }
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
