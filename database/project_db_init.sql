-- Project Service Database Schema (MySQL)
-- Run this script to initialize the project database

CREATE DATABASE IF NOT EXISTS stackfolio_projects;
USE stackfolio_projects;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_link VARCHAR(500),
    live_url VARCHAR(500),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_technologies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    technology VARCHAR(100) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
);

CREATE TABLE IF NOT EXISTS project_highlights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    highlight TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
);

-- Insert sample data
INSERT INTO projects (title, description, github_link, live_url) VALUES
('Stackfolio Portfolio', 'A comprehensive portfolio web application showcasing full-stack development skills with React frontend and Spring Boot microservices backend.', 'https://github.com/yourusername/stackfolio', 'https://yourportfolio.com'),
('E-Commerce Platform', 'Microservices-based e-commerce platform with React frontend, Spring Boot backend, and Kafka event streaming.', 'https://github.com/yourusername/ecommerce', 'https://ecommerce-demo.com'),
('Task Management App', 'Real-time task management application with collaborative features using WebSocket and Spring Cloud.', 'https://github.com/yourusername/taskmanager', 'https://taskmanager-demo.com');

INSERT INTO project_technologies (project_id, technology) VALUES
(1, 'React'), (1, 'TypeScript'), (1, 'Spring Boot'), (1, 'PostgreSQL'), (1, 'Docker'),
(2, 'React'), (2, 'Java'), (2, 'Spring Cloud'), (2, 'MySQL'), (2, 'Kafka'),
(3, 'React'), (3, 'Spring Boot'), (3, 'WebSocket'), (3, 'MongoDB'), (3, 'Redis');

INSERT INTO project_highlights (project_id, highlight) VALUES
(1, 'Microservices architecture with API Gateway'),
(1, 'JWT authentication and role-based access control'),
(1, 'Docker containerization and CI/CD pipelines'),
(2, 'Event-driven architecture with Apache Kafka'),
(2, 'Scalable microservices with Spring Cloud'),
(2, 'Real-time inventory management'),
(3, 'Real-time collaboration features'),
(3, 'WebSocket integration for live updates'),
(3, 'Advanced caching with Redis');