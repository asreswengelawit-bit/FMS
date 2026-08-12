# Material Management System (MMS) - Setup Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Backend Services Setup](#backend-services-setup)
5. [Frontend Setup](#frontend-setup)
6. [Docker Compose Setup](#docker-compose-setup)
7. [IDE Configuration](#ide-configuration)
8. [Verification & Testing](#verification--testing)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

- **OS**: Linux (Ubuntu 20.04+), macOS (10.15+), or Windows 10/11 with WSL2
- **RAM**: Minimum 8GB, Recommended 16GB
- **Disk Space**: Minimum 50GB free space
- **Internet**: Required for downloading dependencies

### Required Software

- **Java 17+**: JDK installation
- **Maven 3.8+**: Build automation
- **Node.js 18+**: Frontend runtime
- **npm 9+**: Node package manager
- **Docker 20+**: Container platform
- **Docker Compose 2+**: Multi-container orchestration
- **Git**: Version control

### Optional Tools

- **PostgreSQL CLI**: Direct database interaction
- **Redis CLI**: Cache management
- **curl/Postman**: API testing
- **IntelliJ IDEA/VSCode**: IDE

---

## Local Development Setup

### Step 1: Install Java

**macOS**:
```bash
# Using Homebrew
brew install openjdk@17

# Set JAVA_HOME
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
echo 'export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home' >> ~/.zshrc
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk

# Verify
java -version
```

**Windows**:
- Download from https://adoptium.net/
- Run installer and follow prompts
- Set `JAVA_HOME` in environment variables

### Step 2: Install Maven

**macOS**:
```bash
brew install maven

# Verify
mvn --version
```

**Ubuntu/Debian**:
```bash
sudo apt install -y maven

# Verify
mvn --version
```

### Step 3: Install Node.js

**Using nvm** (recommended):
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.zshrc  # or ~/.bashrc for bash

# Install Node 18
nvm install 18

# Verify
node --version  # v18.x.x
npm --version   # 9.x.x
```

### Step 4: Install Docker

**macOS**:
```bash
# Install Docker Desktop
brew install --cask docker

# Start Docker daemon
open /Applications/Docker.app
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Step 5: Verify Installations

```bash
java -version          # Java 17+
mvn --version          # Maven 3.8+
node --version         # Node 18+
npm --version          # npm 9+
docker --version       # Docker 20+
docker-compose --version  # Docker Compose 2+
git --version          # Git
```

---

## Database Setup

### PostgreSQL Installation

**Using Docker** (Recommended for development):
```bash
docker run --name mms-postgres \
  -e POSTGRES_DB=mms \
  -e POSTGRES_USER=mms_user \
  -e POSTGRES_PASSWORD=secure_password_change_me \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:14
```

**Verify connection**:
```bash
# Using psql
psql -h localhost -U mms_user -d mms

# You should see: mms=>
```

### Redis Installation

**Using Docker**:
```bash
docker run --name mms-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  -d redis:7 redis-server --appendonly yes
```

**Verify connection**:
```bash
redis-cli
# You should see: 127.0.0.1:6379>
```

### RabbitMQ Installation

**Using Docker**:
```bash
docker run --name mms-rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=guest \
  -e RABBITMQ_DEFAULT_PASS=guest \
  -d rabbitmq:3.12-management
```

**Access Management UI**:
- URL: http://localhost:15672
- Username: guest
- Password: guest

---

## Backend Services Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/mms-platform.git
cd mms-platform
```

### Step 2: Project Structure

```
mms-platform/
├── api-gateway/
├── material-service/
├── inventory-service/
├── warehouse-service/
├── order-service/
├── supplier-service/
├── analytics-service/
├── notification-service/
├── user-service/
├── config-server/
├── pom.xml
└── docker-compose.yml
```

### Step 3: Build All Services

```bash
# Build all modules
mvn clean install

# Build with skipping tests (faster)
mvn clean install -DskipTests

# Build specific service
mvn clean install -pl :material-service

# View build results
ls -la api-gateway/target/
```

### Step 4: Configure Environment

Create `.env` file in project root:

```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/mms
DB_USER=mms_user
DB_PASSWORD=secure_password_change_me

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Application
APP_ENV=development
LOG_LEVEL=INFO
JWT_SECRET=your_jwt_secret_key_change_this
```

### Step 5: Run Services Individually

**Start API Gateway**:
```bash
cd api-gateway
mvn spring-boot:run

# Service will start at http://localhost:8080
```

**Start Material Service** (in new terminal):
```bash
cd material-service
mvn spring-boot:run

# Service will start at http://localhost:8001
```

**Similarly for other services**:
- Inventory Service: `inventory-service` (port 8002)
- Warehouse Service: `warehouse-service` (port 8003)
- Order Service: `order-service` (port 8004)
- Supplier Service: `supplier-service` (port 8005)
- Analytics Service: `analytics-service` (port 8006)
- Notification Service: `notification-service` (port 8007)
- User Service: `user-service` (port 8008)

---

## Frontend Setup

### Step 1: Create React App

```bash
# Using Vite (recommended)
npm create vite@latest mms-frontend -- --template react-ts
cd mms-frontend

# Or using Create React App
npx create-react-app mms-frontend --template typescript
cd mms-frontend
```

### Step 2: Install Dependencies

```bash
npm install

# Install additional libraries
npm install axios redux @reduxjs/toolkit react-redux
npm install tailwindcss postcss autoprefixer
npm install three @types/three
npm install recharts chart.js react-chartjs-2
npm install react-router-dom react-query
```

### Step 3: Configure Environment

Create `.env.development`:

```bash
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_WS_URL=ws://localhost:8080/ws
REACT_APP_ENV=development
```

### Step 4: Start Development Server

```bash
npm start

# Frontend will start at http://localhost:3000
```

### Step 5: Build for Production

```bash
npm run build

# Output in: ./build/
```

---

## Docker Compose Setup

### Complete Stack with Docker Compose

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  # Databases
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: mms
      POSTGRES_USER: mms_user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mms_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  rabbitmq:
    image: rabbitmq:3.12-management
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 30s
      timeout: 10s
      retries: 5

  # Backend Services
  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mms
      SPRING_DATASOURCE_USERNAME: mms_user
      SPRING_DATASOURCE_PASSWORD: password
      SPRING_REDIS_HOST: redis
      SPRING_RABBITMQ_HOST: rabbitmq
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  material-service:
    build:
      context: ./material-service
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mms
      SPRING_DATASOURCE_USERNAME: mms_user
      SPRING_DATASOURCE_PASSWORD: password
      SPRING_REDIS_HOST: redis
      SPRING_RABBITMQ_HOST: rabbitmq
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  inventory-service:
    build:
      context: ./inventory-service
      dockerfile: Dockerfile
    ports:
      - "8002:8002"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mms
      SPRING_DATASOURCE_USERNAME: mms_user
      SPRING_DATASOURCE_PASSWORD: password
      SPRING_REDIS_HOST: redis
      SPRING_RABBITMQ_HOST: rabbitmq
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  # Add other services similarly...

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

  # Frontend
  frontend:
    build:
      context: ./mms-frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8080/api/v1
    depends_on:
      - api-gateway

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
  prometheus_data:
  grafana_data:
```

### Run Complete Stack

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## IDE Configuration

### IntelliJ IDEA

1. **Import Project**:
   - File → Open → Select project root
   - Select "Maven" as project type

2. **Configure Java**:
   - File → Project Structure → Project → SDK: Select Java 17+
   - File → Project Structure → Project → Language level: 17

3. **Configure Plugins**:
   - Install: Lombok, Spring Boot, Docker

4. **Run Configuration**:
   - Edit Configurations → Add → Spring Boot
   - Main class: Select appropriate service class
   - VM options: `-Dspring.profiles.active=dev`

### Visual Studio Code

1. **Install Extensions**:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Docker
   - Postman

2. **Configure settings.json**:

```json
{
  "java.home": "/path/to/java/17",
  "java.configuration.updateBuildConfiguration": "automatic",
  "maven.executable.path": "/path/to/mvn",
  "[java]": {
    "editor.defaultFormatter": "redhat.java",
    "editor.formatOnSave": true
  }
}
```

3. **Run Service**:
   - Debug → Add Configuration → Java
   - Configure arguments and run

---

## Verification & Testing

### Verify Backend Services

```bash
# Check all services are healthy
curl -s http://localhost:8080/api/v1/health | jq

# Should return: 
# {
#   "status": "UP"
# }

# Test each service
curl -s http://localhost:8001/actuator/health/live | jq
curl -s http://localhost:8002/actuator/health/live | jq
# ... etc
```

### Verify Frontend

```bash
# Frontend should be accessible at:
# http://localhost:3000

# Check if React app loads
curl -s http://localhost:3000 | head -20
```

### Sample API Requests

**Create Material**:
```bash
curl -X POST http://localhost:8080/api/v1/materials \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "MAT-001",
    "name": "Steel Plate",
    "unitOfMeasure": "kg",
    "supplierId": "sup-001",
    "unitCost": 45.50,
    "safetyStock": 100,
    "leadTimeDays": 7
  }'
```

**Get Material**:
```bash
curl -s http://localhost:8080/api/v1/materials/mat-001 | jq
```

**Update Material**:
```bash
curl -X PUT http://localhost:8080/api/v1/materials/mat-001 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Steel Plate Updated",
    "unitCost": 50.00
  }'
```

### Run Tests

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn clean test jacoco:report

# Run integration tests
mvn verify

# Run specific test class
mvn test -Dtest=MaterialServiceTest

# Run tests in specific service
cd material-service
mvn test
```

---

## Troubleshooting

### Common Issues

**1. Port Already in Use**

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

**2. Database Connection Error**

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database exists
psql -h localhost -U mms_user -l

# Recreate database
docker-compose down
docker-compose up postgres
```

**3. Maven Build Failures**

```bash
# Clear Maven cache
mvn clean -DskipTests
rm -rf ~/.m2/repository

# Try build again
mvn clean install -DskipTests
```

**4. Node/npm Issues**

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**5. Docker Issues**

```bash
# Restart Docker daemon
sudo systemctl restart docker  # Linux
# or restart Docker Desktop    # macOS/Windows

# Remove dangling images
docker image prune

# Remove all containers
docker ps -a | xargs docker rm
```

### Enable Debug Logging

**Backend** (`application.yml`):
```yaml
logging:
  level:
    root: INFO
    com.mms: DEBUG
    org.springframework: DEBUG
    org.hibernate: DEBUG
```

**Frontend** (`.env`):
```bash
REACT_APP_DEBUG=true
```

---

**Document Version**: 1.0  
**Last Updated**: July 3, 2026  
**Status**: Complete
