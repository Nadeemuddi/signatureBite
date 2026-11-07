/**
 * Seed script — populates the database with sample restaurants, dishes,
 * an admin user and a demo user.
 *
 *   npm run seed            # wipe + import
 *   npm run seed:destroy    # wipe only
 *
 * Works against MONGO_URI, or the in-memory DB if none is set (note: seeding
 * the in-memory DB is pointless because it disappears on exit — set a real
 * MONGO_URI to persist. The API server seeds its own in-memory DB on boot via
 * the --demo flag; see README).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Restaurant from '../models/Restaurant.js';
import Dish from '../models/Dish.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { RESTAURANTS } from './data.js';

export const importData = async () => {
  await Promise.all([
    Restaurant.deleteMany(),
    Dish.deleteMany(),
    Review.deleteMany(),
    User.deleteMany(),
  ]);

  await User.create([
    { name: 'Admin', email: 'admin@foodspot.com', password: 'admin123', role: 'admin' },
    { name: 'Demo User', email: 'user@foodspot.com', password: 'user123', role: 'user' },
  ]);

  for (const entry of RESTAURANTS) {
    const { dishes = [], ...restaurantData } = entry;
    const restaurant = await Restaurant.create(restaurantData);
    if (dishes.length) {
      await Dish.insertMany(dishes.map((d) => ({ ...d, restaurant: restaurant._id })));
    }
  }

  const counts = {
    restaurants: await Restaurant.countDocuments(),
    dishes: await Dish.countDocuments(),
    users: await User.countDocuments(),
  };
  console.log('✔ Seed complete:', counts);
  console.log('  Admin login → admin@foodspot.com / admin123');
  console.log('  User  login → user@foodspot.com / user123');
};

export const destroyData = async () => {
  await Promise.all([
    Restaurant.deleteMany(),
    Dish.deleteMany(),
    Review.deleteMany(),
    User.deleteMany(),
  ]);
  console.log('✔ All data destroyed');
};

// Run directly from the CLI.
const isDirectRun = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isDirectRun) {
  connectDB()
    .then(async () => {
      if (process.argv.includes('--destroy')) await destroyData();
      else await importData();
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
