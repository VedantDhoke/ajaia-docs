const express = require("express");

const {
  getDocuments,
  createDocument,
  getDocument,
  updateDocument,
  shareDocument,
  deleteDocument,
} = require("../controllers/documentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getDocuments);

router.post("/", createDocument);

router.get("/:id", getDocument);

router.delete("/:id", deleteDocument);

router.patch("/:id", updateDocument);

router.post("/:id/share", shareDocument);

module.exports = router;