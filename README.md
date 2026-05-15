# Stackfolio - Enterprise Full-Stack Portfolio Application

A sophisticated portfolio application showcasing full-stack development expertise using enterprise-grade microservices architecture.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                React Frontend (Port 3000)                   │
│         (Tailwind CSS, Axios, React Hooks)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│          API Gateway (Spring Cloud Gateway - 8080)          │
│     (JWT Auth, Rate Limiting, Request Routing)              │
└──────┬──────────────────┬──────────────────┬───────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌────────────────┐
│Profile Srv  │    │ Project Srv │    │Interaction Srv │
│(Port 8081)  │    │(Port 8082)  │    │ (Port 8083)    │
│PostgreSQL   │    │   MySQL     │    │Kafka Producer  │
└─────────────┘    └─────────────┘    └────────┬───────┘
                                                │
                                    ┌───────────▼──────────┐
                                    │   Kafka Broker       │
                                    │   (Message Queue)    │
                                    └───────────┬──────────┘
                                                │
                                    ┌───────────▼──────────────┐
                                    │ Notification Service     │
                                    │ (Kafka Consumer)         │
                                    │ (Email via JavaMail)     │
                                    └──────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                   Redis Cache Layer                            │
│            (Rate Limiting, Session Storage)                    │
└────────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Component | Technology | Port |
|-----------|-----------|------|
| Frontend | React.js + TypeScript + Tailwind CSS | 3000 |
| API Gateway | Spring Cloud Gateway + JWT + Spring Security | 8080 |
| Profile Service | Spring Boot + PostgreSQL + JPA | 8081 |
| Project Service | Spring Boot + MySQL + Mybatis | 8082 |
| Interaction Service | Spring Boot + Kafka Producer | 8083 |
| Notification Service | Spring Boot + Kafka Consumer + JavaMail | (internal) |
| Message Broker | Apache Kafka | 9092 |
| Cache | Redis | 6379 |
| Containerization | Docker + Docker Compose | - |
| CI/CD | GitHub Actions | - |

## 📁 Project Structure

```
Stackfolio/
├── frontend/                      # React application
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service layer
│   │   ├── types/                # TypeScript interfaces
│   │   └── App.tsx
│   ├── Dockerfile                # Frontend container config
│   ├── package.json              # Node dependencies
│   └── tailwind.config.js         # Tailwind CSS config
│
├── backend/                       # Spring Boot microservices
│   ├── api-gateway/              # Spring Cloud Gateway
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── profile-service/          # Biography & Skills
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── project-service/          # Portfolio Projects
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── interaction-service/      # Contact Forms & Events
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   └── notification-service/     # Email Notifications
│       ├── src/main/java/
│       ├── src/main/resources/
│       ├── pom.xml
│       └── Dockerfile
│
├── docker/                        # Docker configuration
│   ├── docker-compose.yml        # Orchestration
│   ├── docker-compose.prod.yml   # Production config
│   ├── kafka/
│   │   ├── Dockerfile
│   │   └── docker-entrypoint.sh
│   └── nginx/
│       ├── nginx.conf            # Reverse proxy
│       └── Dockerfile
│
├── .github/
│   └── workflows/
│       ├── ci-pipeline.yml       # GitHub Actions CI/CD
│       └── cd-pipeline.yml       # CD to cloud
│
├── .github/copilot-instructions.md
├── README.md
└── ARCHITECTURE.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (v20.10+)
- Java 11+ (for local development)
- Node.js v16+ (for local development)
- PostgreSQL & MySQL clients (optional, for local development)

### Local Development (using Docker Compose)

```bash
cd docker
docker-compose up -d
```

This will start:
- PostgreSQL (Profile Service database)
- MySQL (Project Service database)
- Redis (Cache layer)
- Kafka + Zookeeper (Message streaming)
- All microservices
- React frontend

Access the application at: `http://localhost:3000`

### Local Development (without Docker)

#### 1. Start Databases & Message Queue
```bash
# Install on macOS
brew install postgresql mysql redis-server
brew services start postgresql
brew services start redis-server

# Start Kafka locally (download from kafka.apache.org)
./bin/kafka-server-start.sh config/server.properties
```

#### 2. Start Services (in separate terminals)

```bash
# Terminal 1: API Gateway
cd backend/api-gateway
mvn spring-boot:run

# Terminal 2: Profile Service
cd backend/profile-service
mvn spring-boot:run

# Terminal 3: Project Service
cd backend/project-service
mvn spring-boot:run

# Terminal 4: Interaction Service
cd backend/interaction-service
mvn spring-boot:run

# Terminal 5: Notification Service
cd backend/notification-service
mvn spring-boot:run

# Terminal 6: Frontend
cd frontend
npm install
npm start
```

## 📚 API Endpoints

### Profile Service (`/api/profile/`)
- `GET /api/profile/me` - Get profile information
- `GET /api/profile/skills` - Get list of skills
- `GET /api/profile/experience` - Get work experience
- `POST /api/profile/admin/update` - Update profile (admin)

### Project Service (`/api/projects/`)
- `GET /api/projects/` - List all projects
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects/admin/create` - Create project (admin, JWT required)
- `PUT /api/projects/admin/{id}` - Update project (admin, JWT required)
- `DELETE /api/projects/admin/{id}` - Delete project (admin, JWT required)

### Interaction Service (`/api/contact/`)
- `POST /api/contact/message` - Submit contact form (rate limited)
- `POST /api/contact/download-resume` - Trigger resume download event

## 🔐 Security Features

1. **JWT Authentication** - Protected admin endpoints
2. **Rate Limiting** - Redis-based rate limiting (10 req/min for contact form)
3. **CORS** - Configured for frontend domain
4. **Input Validation** - Bean Validation on all requests
5. **SQL Injection Prevention** - Parameterized queries & ORM

## 📧 Email Notifications

When a contact form is submitted:
1. Interaction Service publishes `ContactMessageReceived` event to Kafka
2. Notification Service consumes the event
3. Email is sent via SMTP (Gmail configured by default)

**Configuration** (set in `.env` or service properties):
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_TO=your-email@gmail.com
```

## 🐳 Docker & Deployment

### Build All Services
```bash
docker-compose -f docker/docker-compose.yml build
```

### Production Deployment
```bash
docker-compose -f docker/docker-compose.prod.yml up -d
```

### Cloud Deployment Options
- **AWS**: ECS, EKS, or Elastic Beanstalk
- **GCP**: Cloud Run or GKE
- **Azure**: Container Instances or AKS
- **DigitalOcean**: App Platform or Kubernetes

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed cloud setup instructions.

## 🔄 CI/CD Pipeline

GitHub Actions workflows automate:
1. **Build**: Compile all services
2. **Test**: Run unit & integration tests
3. **Quality**: SonarQube/CodeCov analysis
4. **Security**: Dependency scanning (OWASP)
5. **Push**: Build & push Docker images to registry
6. **Deploy**: Auto-deploy to cloud platform

Triggers:
- Push to `main` → Deploy to production
- Push to `develop` → Deploy to staging
- Pull requests → Run tests & quality checks

## 📖 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system design
- [API_SPEC.md](./backend/API_SPEC.md) - API documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Cloud deployment guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Local development setup

## 🎯 Learning Objectives Covered

✅ **React.js** - Modern component-based UI development  
✅ **Spring Boot** - Production-grade microservices  
✅ **Microservices Architecture** - Service isolation & scalability  
✅ **Apache Kafka** - Event-driven architecture  
✅ **Spring Cloud Gateway** - API gateway pattern  
✅ **JWT & OAuth2** - API authentication & authorization  
✅ **Docker** - Containerization & deployment  
✅ **Docker Compose** - Local orchestration  
✅ **CI/CD** - Automated testing & deployment  
✅ **Database**: PostgreSQL (relational) & MySQL (relational)  
✅ **Redis** - Caching & rate limiting  
✅ **Cloud Deployment** - AWS/GCP/Azure/DigitalOcean  

## 🤝 Contributing

This is a learning project. Feel free to extend it with:
- Unit & integration tests
- Load testing & performance optimization
- Kubernetes deployment configs
- Prometheus metrics & Grafana dashboards
- OpenTelemetry distributed tracing
- GraphQL API layer

## 📞 Contact & Support

Questions about this portfolio project? The contact form right here on the site demonstrates the end-to-end architecture!

---

**Built to showcase:** Full-Stack Development • Microservices • Event-Driven Architecture • Cloud Deployment • DevOps  
**Status:** Production-Ready 🚀
