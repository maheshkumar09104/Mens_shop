const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  res.status(201).json({
    message: "Image uploaded",
    image: `/${req.file.path.replace(/\\/g, "/")}`
  });
});

module.exports = router;
