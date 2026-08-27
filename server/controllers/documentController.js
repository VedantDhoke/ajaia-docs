const Document = require("../models/Document");
const User = require("../models/User");


// GET /api/documents

const getDocuments = async (req, res) => {

  try {

    const documents = await Document.find({
      $or: [
        { owner: req.user._id },
        {
          "sharedWith.user": req.user._id,
        },
      ],
    })
      .populate("owner", "name email")
      .populate(
        "sharedWith.user",
        "name email"
      )
      .sort({
        updatedAt: -1,
      });

    res.json(documents);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// POST /api/documents

const createDocument = async (req, res) => {

  try {

    const {
      title,
      content,
    } = req.body;

    const document = await Document.create({
      title:
        title?.trim() ||
        "Untitled Document",

      content: content || "",

      owner: req.user._id,
    });

    const populatedDocument =
      await Document.findById(
        document._id
      ).populate(
        "owner",
        "name email"
      );

    res.status(201).json(
      populatedDocument
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// GET /api/documents/:id

const getDocument = async (req, res) => {

  try {

    const document =
      await Document.findById(
        req.params.id
      )
        .populate(
          "owner",
          "name email"
        )
        .populate(
          "sharedWith.user",
          "name email"
        );

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    const isOwner =
      document.owner._id.toString() ===
      req.user._id.toString();

    const sharedUser =
      document.sharedWith.find(
        (item) =>
          item.user._id.toString() ===
          req.user._id.toString()
      );

    if (!isOwner && !sharedUser) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    res.json({
      ...document.toObject(),

      canEdit:
        isOwner ||
        sharedUser?.permission === "edit",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// PATCH /api/documents/:id

const updateDocument = async (req, res) => {

  try {

    const document =
      await Document.findById(
        req.params.id
      );

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    const isOwner =
      document.owner.toString() ===
      req.user._id.toString();

    const sharedUser =
      document.sharedWith.find(
        (item) =>
          item.user.toString() ===
          req.user._id.toString()
      );

    const canEdit =
      isOwner ||
      sharedUser?.permission === "edit";

    if (!canEdit) {
      return res.status(403).json({
        message: "You do not have edit permission.",
      });
    }

    if (req.body.title !== undefined) {
      document.title =
        req.body.title.trim() ||
        "Untitled Document";
    }

    if (req.body.content !== undefined) {
      document.content =
        req.body.content;
    }

    await document.save();

    const updatedDocument =
      await Document.findById(
        document._id
      )
        .populate(
          "owner",
          "name email"
        )
        .populate(
          "sharedWith.user",
          "name email"
        );

    res.json(updatedDocument);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// POST /api/documents/:id/share

const shareDocument = async (req, res) => {

  try {

    const {
      email,
      permission = "edit",
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const document =
      await Document.findById(
        req.params.id
      );

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    if (
      document.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Only the owner can share this document.",
      });
    }

    const user =
      await User.findOne({
        email:
          email.toLowerCase().trim(),
      });

    if (!user) {
      return res.status(404).json({
        message:
          "No user found with this email.",
      });
    }

    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        message:
          "You cannot share a document with yourself.",
      });
    }

    const alreadyShared =
      document.sharedWith.some(
        (item) =>
          item.user.toString() ===
          user._id.toString()
      );

    if (alreadyShared) {
      return res.status(400).json({
        message:
          "Document is already shared with this user.",
      });
    }

    document.sharedWith.push({
      user: user._id,
      permission,
    });

    await document.save();

    const updatedDocument =
      await Document.findById(
        document._id
      )
        .populate(
          "owner",
          "name email"
        )
        .populate(
          "sharedWith.user",
          "name email"
        );

    res.json({
      message: "Document shared successfully.",
      document: updatedDocument,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(
      req.params.id
    );

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Only the owner can delete
    if (
      document.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to delete this document",
      });
    }

    await Document.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Document deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete document error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete document",
    });
  }
};

module.exports = {
  getDocuments,
  createDocument,
  getDocument,
  updateDocument,
  shareDocument,
  deleteDocument,
};