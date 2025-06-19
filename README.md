# Real-Time Chat Application Documentation

This is a full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and WebSockets. It allows users to register, log in, create or join chat rooms, and exchange messages in real-time.

---

## 1. Local Setup Instructions

### Prerequisites

* Node.js (v18+ recommended)
* npm (comes with Node.js)
* MongoDB Atlas or a local MongoDB instance

### Environment Setup

#### Backend:

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:

   ```env
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   ```
4. Compile TypeScript:

   ```bash
   npm run build
   ```
5. Start the server:

   ```bash
   npm start
   ```

#### Frontend:

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_WS_URL=ws://localhost:8080
   ```
4. Start the Vite dev server:

   ```bash
   npm run dev
   ```
5. Open the frontend in your browser at [http://localhost:5173](http://localhost:5173)

---

## 2. High Level Design

### i) Introduction

This is a real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with TypeScript. It supports user authentication, room-based chat, and real-time messaging using WebSockets (`ws`). The app is designed for multiple users to join/leave rooms, send messages, and view chat history.

---

### ii) System Overview

- **Frontend:** React (TypeScript, Vite, Redux Toolkit, redux-persist, axios, WebSocket API)
- **Backend:** Node.js (TypeScript, Express.js, ws, Mongoose, JWT, bcryptjs)
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT-based, handled on both frontend and backend
- **Real-time:** WebSocket server for chat and room events

---

### iii) Architecture Diagram

```
+-------------------+        HTTP/REST        +--------------------+
|                   | <---------------------> |                    |
|  React Frontend   |                         |  Express Backend   |
|                   | <--- WebSocket (WS) --->|                    |
+-------------------+                         +--------------------+
        |                                              |
        |                                              |
        |                                              |
        |                                      +-----------------+
        |                                      |   MongoDB       |
        |                                      +-----------------+
```

---

### iv) Data Flow

1. **User Authentication:**  
   - User signs up or logs in via REST API (`/api/auth/signup`, `/api/auth/signin`).
   - JWT token is issued and stored in localStorage (frontend).
   - All subsequent API requests include the JWT in the Authorization header.

2. **Room Management:**  
   - User fetches all rooms via `/api/room`.
   - User can create a room via WebSocket (`create` event).
   - User can join/leave rooms via WebSocket (`join`, `leave`, `confirmJoin` events).

3. **Chat Messaging:**  
   - Messages are sent/received in real-time via WebSocket (`message` event).
   - Chat history is fetched via WebSocket (`history` event) or REST API (`/api/chat/:roomId`).

4. **State Management:**  
   - Redux Toolkit manages user, room, and chat state.
   - redux-persist persists user authentication state.

---

## 3. Low Level Design

### i) API Endpoints

#### a) Auth

- **POST `/api/auth/signup`**  
  Registers a new user.  
  **Body:** `{ name, password }`  
  **Response:** `{ success: true, message: "User created successfully", data: { id, name } }`

- **POST `/api/auth/signin`**  
  Authenticates a user and returns a JWT.  
  **Body:** `{ name, password }`  
  **Response:** `{ "success": true, message: "Login successful", data: { token, user: { id, name } } }`

#### b) Chat

- **GET `/api/chat/:roomId`**  
  Fetches all chat messages for a room.  
  **Response:** `{ success: true, message: "Success", data: { message: "Fetched all chats of the room", data: [ { _id, room_id, user_id: { _id, name }, message, timestamp } ] } }`

#### c) Room

- **GET `/api/room`**  
  Fetches all rooms.  
  **Response:** `{ success: true, message: "Success", data: {  message: "Fetched all rooms", data: [ { _id, name, admin_id } ] } }`

- **GET `/api/room/:roomId`**  
  Fetches a specific room by ID.  
  **Response:** `{ success: true, message: "Success", data: { message: "Fetched room", data: { _id, name, admin_id } } }`

#### d) User

- **GET `/api/user/joinedRooms`**  
  Fetches all rooms joined by the authenticated user.  
  **Headers:** `Authorization: Bearer <token>`  
  **Response:** `{ success: true, message: "Success", data: { message: "Fetched joined rooms successfully", data: [ { _id, name, admin_id, createdAt, updatedAt } ] } }`

---

### ii) Types of Socket Message Events

- **create**  
  - Payload: `{ type: 'create', roomName, userId }`
  - Action: Creates a new room if it doesn't exist, adds user as member, notifies client.

- **confirmJoin**  
  - Payload: `{ type: 'confirmJoin', roomId, userId }`
  - Action: Adds user to room's members, sends chat history.

- **join**  
  - Payload: `{ type: 'join', roomId, userId, username }`
  - Action: If user is a member, connects to room and sends chat history. If not, triggers `needJoinConfirmation`.

- **leave**  
  - Payload: `{ type: 'leave', roomId, userId }`
  - Action: Removes user from room's members, disconnects from room.

- **message**  
  - Payload: `{ type: 'message', roomId, userId, username, message }`
  - Action: Stores message in DB, broadcasts to all clients in the room.

- **history**  
  - Sent by server to client after join/confirmJoin, contains recent messages.

- **needJoinConfirmation**  
  - Sent by server if user tries to join a room they're not a member of.

- **error**  
  - Sent by server on invalid actions or errors.

---

### iii) Data Models

#### User

```typescript
{
  name: string, // unique
  password: string, // hashed
  joined_rooms_ids: [ObjectId], // references Room
  timestamps: true
}
```

#### Room

```typescript
{
  name: string, // unique
  admin_id: ObjectId, // references User
  timestamps: true
}
```

#### Chat

```typescript
{
  room_id: ObjectId, // references Room
  user_id: ObjectId, // references User
  message: string,
  timestamp: Date
}
```

---

### iv) Functional Components

#### Room Handling

- Fetches all rooms (`/api/room`)
- Fetches joined rooms (`/api/user/joinedRooms`)
- Creates new rooms (WebSocket `create`)
- Joins/leaves rooms (WebSocket `join`, `leave`, `confirmJoin`)

#### Chat Handling

- Fetches chat history (`/api/chat/:roomId` or WebSocket `history`)
- Sends/receives messages in real-time (WebSocket `message`)
- Persists messages in MongoDB

#### WebSocket Integration

- Handles all real-time events for room and chat management
- Ensures only authorized users can join/send messages in rooms
- Broadcasts messages to all connected clients in a room

#### Error Handling

- Input validation on backend (e.g., required fields, unique constraints)
- API error responses with appropriate status codes and messages
- WebSocket error events for invalid actions
- Frontend displays user-friendly error messages

---

### v) Frontend Overview

#### a) React App (Vite + TypeScript)

- Fast development with Vite
- State management with Redux Toolkit and redux-persist
- API calls via axios with JWT token in headers
- Real-time communication via WebSocket API

#### b) Components

- **Rooms List Viewer:** Sidebar for listing and navigating rooms, creating new rooms, leaving rooms.
- **User Authentication:** Auth page for signup/signin, JWT token management, protected routes.
- **Chat Interface:** Room page for viewing and sending messages, real-time updates, chat history, join confirmation modal.

#### c) Communication

- **REST API:** For authentication, fetching rooms, fetching chat history.
- **WebSocket:** For real-time room and chat events.

---

## 4. Concurrency Handling (Brief Overview)

* The backend uses the `ws` library to establish WebSocket connections for real-time communication.
* Each connected client is stored in an in-memory `Map<string, Set<ExtendedWebSocket>>` keyed by room ID, which tracks all clients connected to a room.
* Rooms are persistent in MongoDB, but active WebSocket connections per room are managed in-memory.
* A user can join multiple rooms, and messages sent to a room are broadcast only to clients who have joined that room.
* Proper cleanup is done on WebSocket disconnection to remove clients from their joined room sets.

---

## 5. Assumptions and Design Choices

* **Authentication**: JWT is used for authentication. A user must sign up and log in to access room functionality.
* **Room Joining**: Room participation is a two-step process. Users must explicitly confirm before joining a room.
* **Frontend State Management**: Redux Toolkit is used for predictable state handling and to allow easy future scaling.
* **Message Storage**: Messages are stored in MongoDB, and on room join, the last 50 messages are fetched and shown.
* **RBAC (Role-Based Access Control)**: Users can view/chat only in rooms they have joined. This is enforced both in WebSocket events and the database (`joined_rooms_ids`).
* **Deployment Choices**: Backend is deployed on Render for API + WebSocket hosting. Frontend is deployed on GitHub Pages using static Vite build.

---

## 6. Accessing the Deployed Application

* **Frontend URL**: [https://your-username.github.io/chat-app](https://shaswatag.github.io/chat-app)
* **Backend API**: Hosted on [Render](https://render.com) (URL hidden for security but used in `.env`)

To use the deployed app:

1. Visit the frontend link.
2. Register or log in with a username and password.
3. Browse available rooms or create a new room.
4. Join a room to start chatting in real time!

---

This documentation covers the high-level and low-level design, API and WebSocket event flows, data models, and frontend structure as implemented in your codebase.

