const { Pool } = require("pg");
require("dotenv").config();

const pool = process.env.DATABASE2_URL
  ? new Pool({
      connectionString: process.env.DATABASE2_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      database: process.env.DATABASE2_NAME,
      host: process.env.DATABASE2_HOST,
      password: process.env.DATABASE2_PASSWORD,
      user: process.env.DATABASE2_USER,
      port: process.env.DATABASE2_PORT,
    });

module.exports = pool;