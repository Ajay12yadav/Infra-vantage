import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'vermisst',
  password: process.env.DB_PASSWORD || 'vermisst',
  database: process.env.DB_NAME || 'mynewdb',
  port: process.env.DB_PORT || 5432
});

const initializeDatabase = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connected successfully');

    // Set search path
    await client.query('SET search_path TO public');

    // Verify users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' 
        AND tablename = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Creating users table...');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    
    console.log('✅ Users table verified/created');
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

initializeDatabase().catch(console.error);

export default pool;