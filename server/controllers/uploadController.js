const fs = require("fs");
const path = require("path");

const Document = require("../models/Document");

const uploadFile = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file.",
      });
    }

    const extension =
      path.extname(req.file.originalname)
        .toLowerCase();

    if (
      extension !== ".txt" &&
      extension !== ".md"
    ) {

      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        message:
          "Only .txt and .md files are supported.",
      });

    }

    const content =
      fs.readFileSync(
        req.file.path,
        "utf-8"
      );

    const title =
      path.basename(
        req.file.originalname,
        extension
      );

    const document =
      await Document.create({
        title,
        content:
          `<p>${content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\n/g, "<br>")}</p>`,
        owner: req.user._id,
      });

    fs.unlinkSync(req.file.path);

    const populated =
      await Document.findById(
        document._id
      ).populate(
        "owner",
        "name email"
      );

    res.status(201).json(populated);

  } catch (error) {

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  uploadFile,
};