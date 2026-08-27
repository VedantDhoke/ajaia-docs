# Ajaia Docs

A lightweight collaborative document editor built as part of the Ajaia AI-Native Full Stack Developer Assessment.

The application focuses on the core document workflow: creating, editing, saving, uploading, sharing, and managing documents through a simple and usable interface.

## Live Application

Frontend:
https://ajaia-docs-1-6j5r.onrender.com

Backend API:
https://ajaia-docs-x4kx.onrender.com

## Features

### Document Management

- Create new documents
- Rename documents
- Edit documents in the browser
- Automatically persist document changes
- Reopen documents after refresh
- Delete documents with confirmation

### Rich Text Editing

- Bold
- Italic
- Underline
- Headings
- Bulleted lists
- Numbered lists

### File Upload

- Upload supported text-based files
- Convert uploaded content into an editable document
- Maximum upload size: 5 MB

Supported formats:

- `.txt`
- `.md`

### Sharing

- Documents have an owner
- Owners can share documents with another registered user
- Shared documents are visible to the recipient
- Owned and shared documents are visually distinguished
- Shared users cannot delete the owner's document

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected document APIs

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer

### Testing

- Jest
- Supertest

### Deployment

- Render
- MongoDB Atlas

## Project Structure

```text
DocEditor/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── test/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
├── SUBMISSION.md
└── README.md

Local Setup

Prerequisites
    Node.js
    npm
    MongoDB Atlas account or local MongoDB instance

Clone the repository
    git clone https://github.com/VedantDhoke/ajaia-docs.git
    cd DocEditor

Backend Setup
    cd server
    npm install

Create a .env file:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    PORT=5000

start the backend:
    npm start

    The API will run on:
    http://localhost:5000

    Health check:
    http://localhost:5000/api/health


Frontend Setup
    Open another terminal:
    cd client
    npm install

    Create:
    client/.env

    Add:
    VITE_API_URL=http://localhost:5000/api

    Start the frontend:
    npm run dev
    The application will run on:
    http://localhost:5173


Running Tests

    From the server directory:
    npm test
    The test suite verifies document authorization behavior, including preventing shared users from deleting documents owned by another user.

Authentication

The application uses JWT authentication.
After login, the token is stored on the client and attached to protected API requests using an Axios interceptor.


Sharing Flow

User A creates a document.
User A enters another registered user's email.
The document is shared with that user.
User B logs in.
The shared document appears in User B's dashboard.
User B can access the document according to the assigned permission.
User B cannot delete User A's document.


Upload Flow

User selects a supported .txt or .md file.
The file is sent to the backend using multipart form data.
Multer handles the upload.
The backend processes the file content.
A new editable document is created and persisted in MongoDB.


Error Handling

The application includes basic validation and API error handling for:

    Invalid authentication
    Missing authentication tokens
    Invalid document access
    Missing documents
    Invalid sharing users
    File upload failures
    File size limits


Deployment

The application is deployed using Render.
Frontend and backend are deployed as separate services.
MongoDB Atlas is used for persistent application data.
Environment variables are configured separately in the deployment environment.