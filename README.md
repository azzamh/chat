# Chat Application

A real-time chat application with microservices architecture.

![Microservices Architecture](/frontend/doc/system-design.png)<br/>

#### Services:
- **User Service**: Handles user authentication and management
- **Chat Service**: Manages chat rooms and messages
- **Presence Service**: Tracks user online/offline status
- **Realtime Service**: Handles real-time communication using WebSocket

#### Tech stack & frameworks:
- The backend services use Express.js and are containerized with Docker Compose
- The frontend is built with Nuxt.js and Vue

## Features

- Real-time message delivery
- Multiple participants in a single chat room
- Room management (create, join)
- Participant list viewing
- Shared message history
- User presence tracking (online/offline status)
- User authentication (registration, login)

### Presence System

- **Online/Offline Status**
  - Real-time user status tracking
  - Last seen timestamp
  - Status updates across all chat types
  - Automatic status detection using heartbeat mechanism

## App Screenshots

#### Home Screen

![Home Screen](/frontend/doc/chat-list.png)<br/>
_Home screen showing available chat rooms_

#### Chat Room

![Chat Room](/frontend/doc/chat-room.png)<br/>
_Active chat room with message history, participant list & presence statuses_

#### Join Chat Room Dialog

![Join Chat Room](/frontend/doc/join-room.png)<br/>
_Dialog for joining an existing chat room_

#### Login Screen

![Login Screen](/frontend/doc/login.png)<br/>
_User authentication screen_

#### Registration Screen

![Registration Screen](/frontend/doc/registration.png)<br/>
_New user registration form_

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Yarn package manager

## API Endpoints

### User Service

Base URL: `/api/user`

- POST `/register` - Register a new user
- POST `/login` - User login
- POST `/verify-token` - Verify JWT token
- GET `/info` - Get current user info
- GET `/info/:username` - Get user info by username

### Chat Service

Base URL: `/api/chat`

- POST `/room/create` - Create a new chat room
- POST `/room/:room_id/join` - Join a chat room
- GET `/room/:room_id/participants` - Get room participants
- GET `/room/:room_id/details` - Get room details
- GET `/room/list` - Get list of rooms
- GET `/room/:room_id/messages` - Get room messages
- POST `/message/send` - Send a message
- GET `/message/:id` - Get message by ID
- POST `/user` - Add or update user in chat service

### Presence Service

Base URL: `/api/presence`

- POST `/online` - Set user online status
- POST `/typing` - Set user typing status
- GET `/online/:username` - Get user online status
- GET `/typing/:username` - Get user typing status
- GET `/lastseen/:username` - Get user last seen

### Realtime Service

WebSocket Events:

- `send_messages` - Send a new message
- `receive_message` - Receive a new message
- `subscribe_all_users_presence_in_room` - Subscribe to room users presence
- `subscribe_to_user_presence` - Subscribe to specific user presence
- `online_status_heartbeat` - Keep alive user online status
- `online_status_update` - Receive user online status updates

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Start all microservices using Docker Compose:

```bash
docker compose up --build
```

3. After all containers are running successfully, run the database migrations:

```bash
bash ./migration.sh
```

This will start and configure the following services:

- User Service
- Chat Service
- Presence Service
- Realtime Service
- HAProxy (Load Balancer)
- PostgreSQL Database

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

The frontend application will be available at `http://localhost:3000`
