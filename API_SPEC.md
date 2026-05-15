# API Specification - Stackfolio Portfolio Application

## Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://api.yourdomain.com`

## Authentication

### JWT Bearer Token

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
```

**How to Obtain Token:**

1. POST to `/api/auth/login` with credentials
2. Response includes JWT token
3. Store token in localStorage
4. Include in all subsequent requests

### Refresh Token

When JWT expires:
```
POST /api/auth/refresh
Authorization: Bearer <expired_token>
```

## Common Response Format

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "Example"
  },
  "timestamp": "2024-04-29T10:30:00Z"
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-04-29T10:30:00Z"
}
```

### Rate Limit Response (429)
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1714387860
```

---

## Profile Service API

**Base Path**: `/api/profile`  
**Port**: 8081 (internally), 8080 (via gateway)  
**Database**: PostgreSQL

### Get Profile

```http
GET /api/profile/me

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "title": "Full Stack Developer",
    "bio": "Passionate about building scalable systems...",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "location": "San Francisco, CA",
    "profilePictureUrl": "https://cdn.example.com/profile.jpg",
    "socialLinks": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "twitter": "https://twitter.com/johndoe"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-04-29T10:30:00Z"
  }
}
```

### Get Skills

```http
GET /api/profile/skills?category=backend&proficiency=expert

Query Parameters:
  - category (optional): frontend, backend, devops, database
  - proficiency (optional): beginner, intermediate, expert
  - limit (optional): 10
  - offset (optional): 0

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "skillName": "Spring Boot",
      "category": "backend",
      "proficiencyLevel": "expert",
      "yearsOfExperience": 5,
      "endorsements": 42,
      "createdAt": "2024-01-15T00:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "skillName": "Kafka",
      "category": "backend",
      "proficiencyLevel": "advanced",
      "yearsOfExperience": 2,
      "endorsements": 18,
      "createdAt": "2024-02-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "pages": 3
  }
}
```

### Get Work Experience

```http
GET /api/profile/experience

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "companyName": "Tech Company Inc.",
      "jobTitle": "Senior Software Engineer",
      "description": "Led development of microservices architecture...",
      "startDate": "2022-03-15",
      "endDate": null,
      "currentlyWorking": true,
      "technologies": ["Java", "Spring Boot", "Kafka", "Docker"],
      "createdAt": "2024-01-10T00:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "companyName": "StartUp XYZ",
      "jobTitle": "Software Engineer",
      "description": "Built REST APIs and web applications...",
      "startDate": "2020-06-01",
      "endDate": "2022-03-14",
      "currentlyWorking": false,
      "technologies": ["Node.js", "React", "PostgreSQL", "AWS"],
      "createdAt": "2023-12-20T00:00:00Z"
    }
  ]
}
```

### Update Profile (Protected)

```http
POST /api/profile/admin/update
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "John Doe",
  "title": "Full Stack Developer",
  "bio": "Updated bio...",
  "email": "newemail@example.com",
  "phone": "+1-555-0124",
  "location": "San Francisco, CA",
  "profilePictureUrl": "https://cdn.example.com/new-profile.jpg"
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## Project Service API

**Base Path**: `/api/projects`  
**Port**: 8082 (internally), 8080 (via gateway)  
**Database**: MySQL  
**ORM**: MyBatis

### List Projects

```http
GET /api/projects/?limit=10&offset=0&sort=title&order=asc

Query Parameters:
  - limit (optional): 10 (default)
  - offset (optional): 0 (default)
  - sort (optional): title, createdAt, updatedAt
  - order (optional): asc, desc
  - searchTerm (optional): filter by title/description

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "E-commerce Platform",
      "description": "Full-featured e-commerce platform with microservices...",
      "technologies": ["React", "Spring Boot", "Kafka", "Docker"],
      "githubLink": "https://github.com/johndoe/ecommerce",
      "liveUrl": "https://ecommerce-demo.herokuapp.com",
      "imageUrl": "https://cdn.example.com/project1.jpg",
      "highlights": [
        "Microservices architecture",
        "Real-time updates with Kafka",
        "10k+ concurrent users"
      ],
      "createdAt": "2024-01-20T00:00:00Z",
      "updatedAt": "2024-04-29T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Task Management System",
      "description": "Collaborative task management tool...",
      "technologies": ["React", "Node.js", "MongoDB", "Redis"],
      "githubLink": "https://github.com/johndoe/taskmanager",
      "liveUrl": "https://taskmanager-demo.vercel.app",
      "imageUrl": "https://cdn.example.com/project2.jpg",
      "highlights": [
        "Real-time collaboration",
        "Advanced filtering",
        "Mobile responsive"
      ],
      "createdAt": "2024-02-01T00:00:00Z",
      "updatedAt": "2024-03-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 10,
    "offset": 0,
    "pages": 1
  }
}
```

### Get Project Details

```http
GET /api/projects/{id}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "title": "E-commerce Platform",
    "description": "Full-featured e-commerce platform with microservices architecture including real-time order updates, inventory management, and payment processing.",
    "technologies": ["React", "Spring Boot", "Kafka", "Docker", "PostgreSQL"],
    "githubLink": "https://github.com/johndoe/ecommerce",
    "liveUrl": "https://ecommerce-demo.herokuapp.com",
    "imageUrl": "https://cdn.example.com/project1.jpg",
    "detailedDescription": "This project showcases a production-ready e-commerce platform built with modern full-stack technologies...",
    "highlights": [
      "Microservices architecture with 5 independent services",
      "Real-time order updates using Apache Kafka",
      "10k+ concurrent users support",
      "99.9% uptime SLA",
      "100% test coverage"
    ],
    "metrics": {
      "linesOfCode": 45000,
      "codeQuality": "A+",
      "testCoverage": 92,
      "deploymentFrequency": "5x daily"
    },
    "createdAt": "2024-01-20T00:00:00Z",
    "updatedAt": "2024-04-29T10:30:00Z"
  }
}
```

### Create Project (Protected)

```http
POST /api/projects/admin/create
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description...",
  "technologies": ["Technology1", "Technology2"],
  "githubLink": "https://github.com/...",
  "liveUrl": "https://...",
  "imageUrl": "https://..."
}

Response: 201 Created
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": 9,
    "title": "New Project"
  }
}
```

### Update Project (Protected)

```http
PUT /api/projects/admin/{id}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description...",
  "technologies": ["Updated", "Technologies"],
  "githubLink": "https://...",
  "liveUrl": "https://..."
}

Response: 200 OK
{
  "success": true,
  "message": "Project updated successfully"
}
```

### Delete Project (Protected)

```http
DELETE /api/projects/admin/{id}
Authorization: Bearer <JWT_TOKEN>

Response: 204 No Content
```

---

## Interaction Service API

**Base Path**: `/api/contact`  
**Port**: 8083 (internally), 8080 (via gateway)  
**Message Queue**: Kafka

### Submit Contact Form

```http
POST /api/contact/message
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Interested in collaboration",
  "message": "I'd like to discuss a potential project opportunity..."
}

Response: 202 Accepted
{
  "success": true,
  "message": "Message received. Thanks for reaching out!",
  "data": {
    "contactId": "550e8400-e29b-41d4-a716-446655440020",
    "submittedAt": "2024-04-29T10:35:00Z"
  }
}

Headers:
  X-RateLimit-Limit: 10
  X-RateLimit-Remaining: 9
  X-RateLimit-Reset: 1714387860
```

**Rate Limiting**: 10 requests per minute per IP address

**Error Responses**:

```http
400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {"field": "email", "message": "Invalid email format"},
      {"field": "message", "message": "Message must be at least 10 characters"}
    ]
  }
}

429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 1 minute."
  }
}
```

### Get Contact History (Protected, Admin Only)

```http
GET /api/contact/admin/history?limit=20&offset=0

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "contactId": "550e8400-e29b-41d4-a716-446655440020",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "subject": "Interested in collaboration",
      "message": "I'd like to discuss a potential project opportunity...",
      "submittedAt": "2024-04-29T10:35:00Z",
      "status": "new"
    }
  ]
}
```

---

## Notification Service API

**Base Path**: `/api/notifications`  
**Port**: 8084 (internal only)

### Get Notification Status (Protected)

```http
GET /api/notifications/admin/status

Response: 200 OK
{
  "success": true,
  "data": {
    "lastEmailSent": "2024-04-29T10:30:00Z",
    "emailsSentToday": 5,
    "failedEmails": 0,
    "kafkaLag": 0,
    "health": "healthy"
  }
}
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `KAFKA_PUBLISH_ERROR` | 500 | Failed to publish to Kafka |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `EMAIL_SEND_ERROR` | 500 | Email sending failed |

---

## Rate Limiting

### API Gateway Rate Limits

- **Contact Form**: 10 requests/minute per IP
- **General API**: 100 requests/minute per IP
- **Auth Endpoint**: 5 failed attempts per 15 minutes

### Headers

```
X-RateLimit-Limit: 10          # Max requests allowed
X-RateLimit-Remaining: 8       # Remaining requests
X-RateLimit-Reset: 1714387860  # Unix timestamp when limit resets
```

---

## Pagination

Standard pagination parameters for list endpoints:

```
Query Parameters:
  - limit: Items per page (default: 10, max: 100)
  - offset: Number of items to skip (default: 0)
  - sort: Sort field (default: id)
  - order: asc or desc (default: asc)

Response includes:
  pagination: {
    total: 42,
    limit: 10,
    offset: 0,
    pages: 5
  }
```

---

## Versioning

Current API Version: **v1**

Future versions may be accessed via: `/api/v2/...`

---

## Webhooks (Future)

Webhook support is planned for real-time notifications. Check back for updates!

---

## SDKs

Client SDKs available for:
- ✅ JavaScript/TypeScript (frontend)
- 📋 Python (coming soon)
- 📋 Go (coming soon)

---

**Last Updated**: April 2024  
**API Version**: 1.0.0
