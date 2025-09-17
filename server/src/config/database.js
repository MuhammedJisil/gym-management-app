const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gym_management',
  password: process.env.DB_PASSWORD || 'jisil123',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    try {
      await client.query('SELECT 1 FROM members LIMIT 1');
      console.log('✅ Members table exists');
    } catch (err) {
      if (err.code === '42P01') {
        console.log('⚠️  Members table not found. Creating...');
        await client.query(`
          CREATE TABLE IF NOT EXISTS members (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20) NOT NULL,
            membership_type VARCHAR(50) NOT NULL CHECK (membership_type IN ('monthly', 'quarterly', 'yearly')),
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid')),
            photo_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        await client.query(`
          CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
          CREATE INDEX IF NOT EXISTS idx_members_end_date ON members(end_date);
          CREATE INDEX IF NOT EXISTS idx_members_payment_status ON members(payment_status);
        `);
        
        await client.query(`
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
          END;
          $$ language 'plpgsql';
        `);
        
        await client.query(`
          DROP TRIGGER IF EXISTS update_members_updated_at ON members;
          CREATE TRIGGER update_members_updated_at
            BEFORE UPDATE ON members
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `);
        
        console.log('✅ Members table created');
      } else {
        throw err;
      }
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = { pool, initializeDatabase };