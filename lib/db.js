const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.YOUR_MONGO_URI;

if (!MONGODB_URI) {
  console.warn('Warning: MONGODB_URI not set. Set it in environment variables for production.');
}

/**
 * Connection caching for serverless environments.
 * Stores the mongoose connection in global._mongoose to reuse between invocations.
 */
async function connect() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (global._mongoose && global._mongoose.conn) {
    return global._mongoose.conn;
  }

  if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null };
  }

  if (!global._mongoose.promise) {
    const opts = {
      bufferCommands: false,
      // other mongoose options can go here
    };
    global._mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  global._mongoose.conn = await global._mongoose.promise;
  return global._mongoose.conn;
}

// Ticket Schema and Model
const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, default: 'General' },
  description: { type: String, required: true },
  status: { type: String, default: 'Open' },
  createdAt: { type: Date, default: Date.now }
});

function getTicketModel() {
  // ensure connection is established before compiling model
  try {
    return mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
  } catch (err) {
    return mongoose.model('Ticket', ticketSchema);
  }
}

module.exports = { connect, getTicketModel };
