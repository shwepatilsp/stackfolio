-- Profile Service Database Schema (PostgreSQL)
-- Run this script to initialize the profile database

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    website_url VARCHAR(500),
    profile_image_url VARCHAR(500),
    resume_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    proficiency_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_experiences (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    location VARCHAR(255),
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO profiles (name, title, bio, email, location, linkedin_url, github_url) VALUES
('Your Name', 'Full Stack Developer', 'Passionate full-stack developer with expertise in React, Spring Boot, and cloud technologies.', 'your.email@example.com', 'Your Location', 'https://linkedin.com/in/yourprofile', 'https://github.com/yourusername');

INSERT INTO skills (profile_id, name, category, proficiency_level) VALUES
(1, 'Java', 'Backend', 'Expert'),
(1, 'Spring Boot', 'Backend', 'Expert'),
(1, 'React', 'Frontend', 'Advanced'),
(1, 'TypeScript', 'Frontend', 'Advanced'),
(1, 'PostgreSQL', 'Database', 'Advanced'),
(1, 'MySQL', 'Database', 'Advanced'),
(1, 'Docker', 'DevOps', 'Intermediate'),
(1, 'Kubernetes', 'DevOps', 'Intermediate');

INSERT INTO work_experiences (profile_id, company_name, position, start_date, end_date, description, is_current) VALUES
(1, 'Tech Company', 'Senior Software Engineer', '2022-01-01', NULL, 'Leading development of microservices architecture using Spring Boot and React.', TRUE),
(1, 'Startup Inc', 'Full Stack Developer', '2020-06-01', '2021-12-31', 'Developed and maintained web applications using modern JavaScript frameworks.', FALSE);