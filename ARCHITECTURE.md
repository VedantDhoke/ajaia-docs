# Architecture Note

## Overview

Ajaia Docs follows a simple MERN architecture designed to keep the implementation understandable while providing a complete full-stack workflow.

```text
React + Vite
     |
     | Axios / REST API
     |
Node.js + Express
     |
     | Mongoose
     |
MongoDB Atlas


Frontend

The frontend is implemented using React and Vite.
Responsibilities include:

    Authentication UI
    Dashboard
    Document editor
    Document management
    Sharing UI
    File upload UI
    API communication
    Client-side routing

Axios is centralized in a service module so authentication tokens can automatically be attached to protected requests.


Backend

The backend uses Node.js and Express.
The API is separated into:

    Routes
    Controllers
    Models
    Middleware
    Configuration

Authentication is handled using JWT.
Protected routes use authentication middleware to identify the current user before allowing document operations.


Data Model

User
    User
    ├── name
    ├── email
    ├── password
    └── timestamps

Document
    Document
    ├── title
    ├── content
    ├── owner
    ├── sharedWith[]
    │   ├── user
    │   └── permission
    └── timestamps
The document stores its owner and a list of users with whom it has been shared.


Authorization

Document operations verify ownership or sharing access before modifying data.
Ownership is intentionally simple for this assessment:

    Owners can manage their documents.
    Shared users can access documents shared with them.
    Shared users cannot delete documents they do not own.


File Upload

Multer handles multipart file uploads.
The initial supported workflow focuses on text-based files such as .txt and .md.
Uploaded content is converted into an editable document rather than building a full document-storage platform.


Persistence

MongoDB Atlas stores:
    Users
    Documents
    Sharing relationships
    Document content

This ensures documents survive application refreshes and backend restarts.


Testing

Jest and Supertest are used for backend testing.
The included authorization test verifies that a shared user cannot delete another user's document.


Deployment

The frontend and backend are deployed separately on Render.
The frontend communicates with the deployed backend using the VITE_API_URL environment variable.
The backend uses CLIENT_URL to configure CORS.


Tradeoffs

The implementation intentionally avoids:
Real-time collaborative editing
WebSocket infrastructure
Complex role/permission systems
Enterprise authentication
Version history
Comments
Advanced document formatting
External object storage

These features would increase complexity without improving the core assessment signal significantly within the available time.