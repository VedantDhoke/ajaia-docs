const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

const protect = require("./middleware/authMiddleware");

const {
  uploadFile,
} = require("./controllers/uploadController");

const errorHandler =
  require("./middleware/errorMiddleware");

const multer = require("multer");

dotenv.config();

// connectDB();

if (require.main === module) {
  connectDB();
}

const app = express();


// Middleware

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

app.use(express.urlencoded({
  extended: true,
}));


// Upload configuration

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        path.join(
          __dirname,
          "uploads"
        )
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


// Routes

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

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);

app.post(
  "/api/documents/upload",
  protect,
  upload.single("file"),
  uploadFile
);


// Error handler

app.use(errorHandler);


// const PORT =
//   process.env.PORT || 5000;

// app.listen(
//   PORT,
//   () => {

//     console.log(
//       `Server running on port ${PORT}`
//     );

//   }
// );

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
}

module.exports = app;