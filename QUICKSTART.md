# Quick Start Guide - Stackfolio Portfolio Application

## 🚀 Start Here

This guide will get you up and running with Stackfolio in 5 minutes using Docker!

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- 8GB RAM available
- ~30GB disk space (for node_modules, Maven cache, Docker images)

## The Fastest Way to Start

### 1. Clone and Navigate
```bash
cd Stackfolio
```

### 2. Copy Environment Configuration
```bash
cp .env.example .env
# Optional: Edit .env if you want to customize ports or settings
```

### 3. Start Everything with Docker Compose
```bash
cd docker
docker-compose up -d
```

### 4. Wait for Services to Start
```bash
# Monitor startup progress
docker-compose logs -f

# Services are ready when you see:
# "Started Application in X seconds"
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Adminer (Database UI)**: http://localhost:8081

## Without Docker? (Local Development)

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed local setup instructions.

## Project Structure at a Glance

```
Stackfolio/
├── frontend/              # React app (Port 3000)
├── backend/               # 5 Spring Boot microservices
│   ├── api-gateway/       # (Port 8080)
│   ├── profile-service/   # (Port 8081)
│   ├── project-service/   # (Port 8082)
│   ├── interaction-service/ # (Port 8083)
│   └── notification-service/ # (Port 8084)
├── docker/                # Docker Compose configs
└── .github/               # CI/CD pipelines
```

## Important Files

- **README.md** - Overview and features
- **ARCHITECTURE.md** - Deep dive into system design
- **DEVELOPMENT.md** - Local development setup
- **DEPLOYMENT.md** - Cloud deployment guide
- **API_SPEC.md** - Complete API reference
- **.env.example** - Environment configuration template

## Next Steps After Starting

### 1. Explore the Portfolio
- Visit http://localhost:3000
- Browse Profile & Projects pages
- Try the Contact form

### 2. Test the Contact Form
The contact form demonstrates the complete microservices flow:
1. React Frontend submits form
2. API Gateway validates & rate limits
3. Interaction Service publishes to Kafka
4. Notification Service sends email (see logs)

### 3. Access Databases

**PostgreSQL** (Profile Service):
```bash
# Connection details:
Host: localhost
Port: 5432
User: postgres
Password: postgres
Database: profile_db

# Or use docker exec:
docker exec stackfolio-postgres psql -U postgres -d profile_db -c "SELECT * FROM profiles;"
```

**MySQL** (Project Service):
```bash
# Connection details:
Host: localhost
Port: 3306
User: projects_user
Password: projects_pass
Database: projects_db

# Or use docker exec:
docker exec stackfolio-mysql mysql -u projects_user -pprojects_pass projects_db -e "SELECT * FROM projects;"
```

### 4. Useful Commands

```bash
# View all services
docker-compose ps

# View specific service logs
docker-compose logs api-gateway -f

# Stop all services
docker-compose down

# Stop and clean up all data
docker-compose down -v

# Restart a service
docker-compose restart profile-service

# Execute command in container
docker-compose exec profile-service curl http://localhost:8081/actuator/health
```

## API Examples

### Get Profile Data
```bash
curl -X GET http://localhost:8080/api/profile/me \
  -H "Content-Type: application/json"
```

### Get All Projects
```bash
curl -X GET http://localhost:8080/api/projects/ \
  -H "Content-Type: application/json"
```

### Submit Contact Form
```bash
curl -X POST http://localhost:8080/api/contact/message \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "subject": "Hello!",
    "message": "I am interested in connecting."
  }'
```

## Development Tips

### 1. Real-time Code Changes
- **Frontend**: Changes auto-update in browser (hot reload)
- **Backend**: Requires service restart (use `docker-compose restart`)

### 2. Debug Application Logs
```bash
# All services
docker-compose logs -f

# Specific service with timestamp
docker-compose logs -f --timestamps api-gateway
```

### 3. Check Service Health
```bash
# API Gateway health
curl http://localhost:8080/actuator/health

# Profile Service health
curl http://localhost:8081/actuator/health
```

## Email Configuration

By default, email notifications are not sent (logged to console).

To enable real Gmail notifications:

1. Create Gmail App Password: https://myaccount.google.com/apppasswords
2. Edit `.env` file:
   ```
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_TO=your-email@gmail.com
   ```
3. Restart notification service:
   ```bash
   docker-compose restart notification-service
   ```

## Common Issues & Solutions

### Issue: Ports Already in Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill it
kill -9 <PID>

# Or use different ports in .env
```

### Issue: Out of Disk Space
```bash
# Clean up Docker resources
docker system prune -a

# Or run with limited resources
docker-compose down -v
```

### Issue: Services Won't Start
```bash
# Check detailed logs
docker-compose logs profile-service

# Rebuild images
docker-compose build --no-cache

# Start again
docker-compose up -d
```

## Architecture Overview

```
┌─────────────────────────────────┐
│   React Frontend (3000)         │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   API Gateway (8080)            │
│  - JWT Validation               │
│  - Rate Limiting (Redis)        │
└──────┬──────────────┬───────────┘
       │              │
   ┌───▼────────┐   ┌─▼──────────┐
   │Profile Svc │   │Project Svc │
   │PostgreSQL  │   │  MySQL     │
   └────────────┘   └────────────┘

   ┌─────────────────────────────┐
   │ Interaction Service (8083)  │
   │ Publishes to Kafka          │
   └──────────┬──────────────────┘
              │
   ┌──────────▼──────────────────┐
   │   Kafka Broker              │
   │   (Message Queue)           │
   └──────────┬──────────────────┘
              │
   ┌──────────▼──────────────────┐
   │Notification Service (8084)  │
   │Sends Emails                 │
   └─────────────────────────────┘
```

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| API Gateway | Spring Cloud Gateway + JWT + Spring Security |
| Profile Service | Spring Boot + PostgreSQL + JPA |
| Project Service | Spring Boot + MySQL + MyBatis |
| Interaction Service | Spring Boot + Kafka Producer |
| Notification Service | Spring Boot + Kafka Consumer + JavaMail |
| Messaging | Apache Kafka |
| Caching | Redis |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## Next: Production Deployment

Once comfortable with development, deploy to the cloud:
- [AWS ECS](./DEPLOYMENT.md#aws-ecs-elastic-container-service)
- [Google Cloud Run](./DEPLOYMENT.md#google-cloud-platform-cloud-run--cloudsql)
- [Azure Container Instances](./DEPLOYMENT.md#microsoft-azure-container-instances--app-service)
- [DigitalOcean App Platform](./DEPLOYMENT.md#digitalocean-app-platform)

## Learning Resources

- **Architecture Deep Dive**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Local Development**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **API Reference**: [API_SPEC.md](./API_SPEC.md)
- **Production Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Support & Community

- Report bugs: GitHub Issues
- Discuss ideas: GitHub Discussions
- Check FAQ: See README.md

## What You've Learned

By running this project, you're experiencing:

✅ **React.js** - Modern UI development  
✅ **Microservices** - Independent scalable services  
✅ **Spring Boot** - Production-grade frameworks  
✅ **Kafka** - Event-driven architecture  
✅ **Docker** - Container orchestration  
✅ **PostgreSQL & MySQL** - Relational databases  
✅ **Redis** - Caching & rate limiting  
✅ **JWT** - API authentication  
✅ **CI/CD** - Automated testing & deployment  
✅ **Cloud Ready** - AWS/GCP/Azure deployment  

---

**Happy Coding!** 🚀

For questions, refer to the documentation files or GitHub Issues.
