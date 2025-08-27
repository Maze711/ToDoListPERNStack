const { Pool } = require("pg");
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../config/.env");
require("dotenv").config({ path: dotenvPath }); // Load .env from config folder

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test connection and log errors if any
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully");
    release();
  }
});

module.exports = pool;