# Stackfolio - System Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Components](#system-components)
3. [Data Flow](#data-flow)
4. [Security Architecture](#security-architecture)
5. [Technology Decisions](#technology-decisions)
6. [Scalability & Performance](#scalability--performance)
7. [Deployment Architecture](#deployment-architecture)

## Overview

Stackfolio is an enterprise-grade portfolio application designed to showcase full-stack development expertise using industry-standard microservices architecture. The system demonstrates practical implementation of:

- **Microservices Architecture**: Independent, loosely-coupled services
- **Event-Driven Communication**: Asynchronous messaging via Apache Kafka
- **API Gateway Pattern**: Centralized routing, authentication, and rate limiting
- **Database Polyglot**: PostgreSQL (relational) and MySQL (relational) with data consistency patterns
- **Caching Layer**: Redis for performance optimization and distributed rate limiting
- **Containerization**: Docker for consistent deployment across environments
- **CI/CD**: Automated testing and deployment pipelines

## System Components

### 1. Frontend (React.js - Port 3000)

**Technology Stack**:
- React 18.2 with TypeScript
- Tailwind CSS for styling
- Axios for HTTP communication
- React Router for navigation

**Responsibilities**:
- Portfolio showcase UI
- Project management dashboard (admin)
- Contact form submission
- Resume download functionality

**Key Features**:
- Responsive design (mobile-first)
- Type-safe components with TypeScript
- Client-side state management (React Hooks)
- JWT token handling for authenticated requests
- Error boundaries and loading states

### 2. API Gateway (Spring Cloud Gateway - Port 8080)

**Technology Stack**:
- Spring Cloud Gateway 4.0
- Spring Security 6.0
- JWT (JJWT) for token validation
- Spring Data Redis integration

**Responsibilities**:
- Request routing to microservices
- Authentication & Authorization
- Rate limiting
- Cross-Origin Resource Sharing (CORS)
- Request/Response transformation

**Key Routes**:
```
/api/profile/**      → Profile Service (8081)
/api/projects/**     → Project Service (8082)
/api/contact/**      → Interaction Service (8083)
```

**Security Filters**:
1. **JWT Validation**: Validates Bearer tokens for admin endpoints
2. **Rate Limiting**: Redis-backed rate limiting (10 req/min for contact form)
3. **CORS Filter**: Allows cross-origin requests from frontend
4. **Request Logging**: Logs all incoming requests for audit trail

**Authentication Flow**:
```
Client Request
    ↓
API Gateway
    ↓
JWT Validation Filter
    ├─ If Valid → Add user context to header
    ├─ If Invalid → Return 401 Unauthorized
    └─ If Missing → Check if endpoint requires auth
    ↓
Rate Limiting Filter
    ├─ Check Redis counter per IP
    ├─ If Exceeded → Return 429 Too Many Requests
    └─ If OK → Increment counter
    ↓
Route to Target Service
```

### 3. Profile Service (Spring Boot - Port 8081)

**Technology Stack**:
- Spring Boot 3.1
- Spring Data JPA
- PostgreSQL 15
- Lombok for boilerplate reduction

**Database Schema** (PostgreSQL):
```sql
-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id),
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    years_of_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work Experience table
CREATE TABLE work_experiences (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id),
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**API Endpoints**:
- `GET /api/profile/me` - Get profile information
- `GET /api/profile/skills` - Get all skills
- `GET /api/profile/experience` - Get work experience
- `POST /api/profile/admin/update` (protected) - Update profile

### 4. Project Service (Spring Boot - Port 8082)

**Technology Stack**:
- Spring Boot 3.1
- MyBatis for SQL mapping
- MySQL 8.0
- Connection pooling (HikariCP)

**Database Schema** (MySQL):
```sql
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_link VARCHAR(500),
    live_url VARCHAR(500),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_technologies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL REFERENCES projects(id),
    technology VARCHAR(100) NOT NULL,
    UNIQUE KEY unique_project_tech (project_id, technology)
);
```

**API Endpoints**:
- `GET /api/projects/` - List all projects (paginated)
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects/admin/create` (protected) - Create project
- `PUT /api/projects/admin/{id}` (protected) - Update project
- `DELETE /api/projects/admin/{id}` (protected) - Delete project

### 5. Interaction Service (Spring Boot - Port 8083)

**Technology Stack**:
- Spring Boot 3.1
- Spring Kafka
- Spring Data Redis
- Message validation (Bean Validation)

**Responsibilities**:
- Handle contact form submissions
- Publish events to Kafka
- Rate limiting check
- Resume download tracking

**Kafka Topic**: `contact-message-topic`

**Message Schema**:
```json
{
  "contactId": "uuid",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "submittedAt": "ISO8601 timestamp",
  "clientIp": "string"
}
```

**Rate Limiting Logic**:
```
Key: "contact-form:ip:{clientIp}"
Max Requests: 10
Window: 1 minute

Algorithm:
1. Increment counter in Redis
2. If counter == 1, set expiry to 1 minute
3. If counter > limit, reject with 429
```

### 6. Notification Service (Spring Boot - Port 8084)

**Technology Stack**:
- Spring Boot 3.1
- Spring Kafka Consumer
- Spring Mail (JavaMail)
- Freemarker for email templating

**Responsibilities**:
- Consume messages from Kafka
- Send email notifications
- Error handling and retry logic
- Email template rendering

**Kafka Consumer Group**: `notification-group`
**Subscription**: `contact-message-topic`

**Email Template Variables**:
```
- recipientName
- senderName
- senderEmail
- subject
- messageText
- submittedDateTime
```

**Email Sending Flow**:
```
Kafka Message Received
    ↓
Deserialize Message
    ↓
Validate Email Data
    ↓
Render Freemarker Template
    ↓
Build MIME Message
    ↓
Send via SMTP
    ├─ Success → Log completion
    └─ Failure → Log error & potentially retry
```

## Data Flow

### Contact Form Submission Flow

```sequence
participant User as User Browser
participant Frontend as React Frontend
participant Gateway as API Gateway
participant Interaction as Interaction Service
participant Kafka as Kafka Broker
participant Notification as Notification Service
participant Mail as SMTP Server

User->>Frontend: Fill contact form
Frontend->>Frontend: Validate input
Frontend->>Gateway: POST /api/contact/message
Gateway->>Gateway: Check JWT (not required)
Gateway->>Gateway: Check rate limit (Redis)
Gateway->>Interaction: Forward request
Interaction->>Interaction: Validate message
Interaction->>Kafka: Publish ContactMessageReceived event
Kafka-->>Interaction: Event published
Interaction-->>Gateway: Response 202 Accepted
Gateway-->>Frontend: Response 202 Accepted
Frontend-->>User: Show "Thanks for reaching out"

Kafka->>Notification: Async message consumption
Notification->>Notification: Parse message
Notification->>Notification: Render email template
Notification->>Mail: Send email
Mail-->>Notification: Email sent (async)
Notification->>Notification: Log success
```

### Profile Retrieval Flow

```sequence
participant User as User Browser
participant Frontend as React Frontend
participant Gateway as API Gateway
participant Profile as Profile Service
participant Cache as Redis Cache
participant Database as PostgreSQL

User->>Frontend: Browse portfolio
Frontend->>Gateway: GET /api/profile/me
Gateway->>Gateway: Check rate limit
Gateway->>Profile: Forward request
Profile->>Cache: Check cache ("profile:me")
alt Cache HIT
    Cache-->>Profile: Return cached profile
else Cache MISS
    Profile->>Database: SELECT from profiles
    Database-->>Profile: Profile data
    Profile->>Cache: Store profile (TTL: 1 hour)
    Cache-->>Profile: Stored
end
Profile-->>Gateway: Return profile JSON
Gateway-->>Frontend: Return profile JSON
Frontend-->>User: Render profile UI
```

## Security Architecture

### Authentication & Authorization

**JWT Token Structure**:
```json
{
  "header": {
    "alg": "HS512",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "role": "ADMIN",
    "iat": 1630000000,
    "exp": 1630086400
  }
}
```

**Protected Endpoints**:
- Profile Service: `POST /api/profile/admin/update`
- Project Service: All `/admin/**` endpoints
- Interaction Service: None (public)

**Token Validation Flow**:
```
1. Extract from Authorization header (Bearer scheme)
2. Verify signature using secret key
3. Check expiration time
4. Extract claims and add to request context
5. Check role-based access control (RBAC)
```

### Rate Limiting

**Implementation**: Redis-backed sliding window counter

**Configuration**:
- Contact Form: 10 requests per minute per IP
- General API: 100 requests per minute per IP
- Auth Endpoint: 5 failed attempts per 15 minutes

**Redis Key Pattern**:
```
{endpoint}:{category}:{identifier}
Example: contact-form:ip:192.168.1.1
```

### Data Protection

1. **In Transit**: HTTPS/TLS encryption (enforced in production)
2. **At Rest**: 
   - PostgreSQL: Native encryption at filesystem level
   - MySQL: Encrypted credentials in environment variables
   - Redis: Password-protected (production only)
3. **Sensitive Fields**: Email addresses hashed before storage (optional)

## Technology Decisions

### Why PostgreSQL for Profile Service?
- **ACID Compliance**: Ensures data consistency for profile information
- **JSON Support**: Can store complex profile data
- **Advanced Features**: Window functions, CTEs for analytics
- **Proven Reliability**: Used in production by major companies

### Why MySQL for Project Service?
- **Simplicity**: Lightweight relational database
- **Wide Support**: Excellent hosting provider support
- **MyBatis Integration**: Better SQL control for complex queries
- **Scalability**: Easy horizontal scaling with read replicas

### Why Kafka for Messaging?
- **Durability**: Messages persisted on disk
- **Scalability**: High throughput (millions msg/sec)
- **Replay Capability**: Can reprocess historical events
- **Industry Standard**: Widely adopted for streaming

### Why Redis for Caching?
- **Performance**: In-memory data structure store
- **Atomic Operations**: Essential for rate limiting
- **Data Structures**: Lists, sets, hashes for flexible use
- **TTL Support**: Automatic key expiration

## Scalability & Performance

### Horizontal Scaling Strategy

```
API Gateway (Load Balanced)
├── Gateway Instance 1
├── Gateway Instance 2
└── Gateway Instance N

Profile Service Instances (Load Balanced)
├── Profile Instance 1 (8081)
├── Profile Instance 2 (8082)
└── Profile Instance N

Project Service Instances
├── Project Instance 1 (8082)
├── Project Instance 2 (8083)
└── Project Instance N

Notification Service Instances
├── Notification Instance 1 (Kafka Consumer Group)
├── Notification Instance 2 (Kafka Consumer Group)
└── Notification Instance N (Kafka Consumer Group)

Shared Infrastructure
├── PostgreSQL Primary + Read Replicas
├── MySQL Primary + Read Replicas
├── Redis Cluster
└── Kafka Broker Cluster
```

### Caching Strategy

**Multi-Level Caching**:
1. **Browser Cache**: Static assets (via Cache-Control headers)
2. **Redis Cache**: Hot data (profiles, projects)
3. **Database Cache**: Query result caching

**Cache Invalidation**:
- Time-based: Set TTL per resource type
- Event-based: Invalidate on update/delete
- Manual: Admin-triggered cache flush

**Cache Hit Rates Target**: 80%+ for profile data

### Database Performance Optimization

**Profile Service (PostgreSQL)**:
```sql
-- Index on frequently queried columns
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_skills_profile_id ON skills(profile_id);

-- Composite index for complex queries
CREATE INDEX idx_work_exp_profile_dates 
ON work_experiences(profile_id, start_date DESC);
```

**Project Service (MySQL)**:
```sql
-- Index for filtering and sorting
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Full-text search index
CREATE FULLTEXT INDEX idx_projects_search 
ON projects(title, description);
```

### Load Testing Targets

- **Concurrent Users**: 10,000
- **Requests/Second**: 5,000
- **99th Percentile Latency**: < 200ms
- **Error Rate**: < 0.1%

## Deployment Architecture

### Development Environment

```
Docker Compose (Local)
├── Frontend (Port 3000)
├── API Gateway (Port 8080)
├── Profile Service (Port 8081)
├── Project Service (Port 8082)
├── Interaction Service (Port 8083)
├── Notification Service (Port 8084)
├── PostgreSQL (Port 5432)
├── MySQL (Port 3306)
├── Redis (Port 6379)
├── Zookeeper (Port 2181)
└── Kafka (Port 9092)
```

### Staging Environment

```
Kubernetes Cluster (staging namespace)
├── Frontend Ingress → Frontend Service
├── API Gateway Deployment (replicas: 2)
├── Profile Service StatefulSet
├── Project Service StatefulSet
├── Interaction Service Deployment
├── Notification Service Deployment
├── PostgreSQL (Managed Service)
├── MySQL (Managed Service)
├── Redis (Managed Service)
└── Kafka (Managed Service)
```

### Production Environment

```
Kubernetes Cluster (production namespace)
├── Frontend CDN → Frontend Service
├── API Gateway Deployment (replicas: 3)
├── Profile Service StatefulSet (replicas: 3)
├── Project Service StatefulSet (replicas: 3)
├── Interaction Service Deployment (replicas: 2)
├── Notification Service Deployment (replicas: 2)
├── PostgreSQL (Multi-AZ, Automatic Failover)
├── MySQL (Multi-AZ, Read Replicas)
├── Redis Sentinel (HA)
└── Kafka Cluster (3+ brokers)
```

### Disaster Recovery

- **RTO (Recovery Time Objective)**: 15 minutes
- **RPO (Recovery Point Objective)**: 5 minutes
- **Backup Strategy**: 
  - Daily full backups (S3)
  - Hourly incremental backups
  - Point-in-time recovery enabled
- **Failover**: Automated with health checks

---

**Last Updated**: April 2024  
**Architecture Version**: 1.0.0
