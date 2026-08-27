const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

const protect = require("./middleware/authMiddleware");

const {
  uploadFile,
} = require("./controllers/uploadController");

const errorHandler =
  require("./middleware/errorMiddleware");

dotenv.config();


// Connect to MongoDB
// Only connect when this file is run directly.
// This prevents Jest from creating another MongoDB connection.

if (require.main === module) {
  connectDB();
}


const app = express();


// ================================
// Middleware
// ================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ================================
// Upload Configuration
// ================================

// Create uploads directory if it doesn't exist.
// This is required for production deployment on Render.

const uploadDir =
  path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}


const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        uploadDir
      );

    },

    filename: (
      req,
      file,
      cb
    ) => {

      const uniqueName =
        `${Date.now()}-${file.originalname}`;

      cb(
        null,
        uniqueName
      );

    },

  });


const upload =
  multer({
    storage,

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },

  });


// ================================
// Routes
// ================================


// Health check

app.get(
  "/api/health",
  (req, res) => {

    res.json({
      status: "OK",
      message:
        "Ajaia Docs API is running",
    });

  }
);


// Authentication routes

app.use(
  "/api/auth",
  authRoutes
);


// Document routes

app.use(
  "/api/documents",
  documentRoutes
);


// File upload

app.post(
  "/api/documents/upload",
  protect,
  upload.single("file"),
  uploadFile
);


// ================================
// Error Handler
// ================================

app.use(errorHandler);


// ================================
// Server
// ================================

const PORT =
  process.env.PORT || 5000;


if (require.main === module) {

  app.listen(
    PORT,
    () => {

      console.log(
        `Server running on port ${PORT}`
      );

    }
  );

}


// Export app for testing

module.exports = app;