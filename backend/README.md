# Backend Services Setup

## Running the Services

1. Start all microservices using Docker Compose:
```bash
docker compose up --build
```

2. After all containers are running successfully, run the database migrations:
```bash
bash ./migration.sh
```

This will:
- Install required dependencies for each service
- Generate database schemas
- Run migrations for the following services:
  - Presence Service
  - Chat Service
  - User Service

## Services Architecture
- User Service: Handles user authentication and management
- Chat Service: Manages chat rooms and messages
- Presence Service: Tracks user online/offline status
- Realtime Service: Handles real-time communication
- HAProxy: Load balancer for the microservices
