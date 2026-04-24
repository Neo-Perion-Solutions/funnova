const { Pool } = require('pg');
require('dotenv').config();

// Neon cloud PostgreSQL connection (uses DATABASE_URL with SSL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon TLS connections
  },
});

pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL cloud database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle DB client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  // Get a client for transaction handling
  getClient: async () => {
    return await pool.connect();
  },
};
