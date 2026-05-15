-- Interaction Service Database Schema (PostgreSQL)
-- Run this script to initialize the interaction database

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (optional - usually contacts are created via the API)
-- No sample data needed for contacts as they come from user interactions