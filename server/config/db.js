import mongoose from 'mongoose';

/**
 * Connect to MongoDB.
 *
 * If MONGO_URI is not provided we spin up an in-memory MongoDB instance so the
 * API can run end-to-end without any local database installed. This is ideal
 * for demos and CI; data is ephemeral and lost on restart.
 */
export const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    // Lazy import so production installs can skip the dev dependency.
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri('foodspot');
    console.log('⚠  No MONGO_URI set — using in-memory MongoDB (data is not persisted).');
  }

  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri);
  console.log(`✔ MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
