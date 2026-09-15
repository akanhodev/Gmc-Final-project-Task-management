const mongoose = require('mongoose');

const RETRY_DELAY_MS = 5000;

/**
 * Establishes a connection to MongoDB using the URI defined in the
 * environment variables. Retries on failure instead of killing the
 * process, so a transient outage (e.g. Atlas IP whitelist not yet
 * propagated) doesn't take the whole server down — requests just wait
 * on Mongoose's operation buffering until the connection comes up.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected, retrying...');
      setTimeout(connectDB, RETRY_DELAY_MS);
    });
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    console.error(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(connectDB, RETRY_DELAY_MS);
  }
};

module.exports = connectDB;
