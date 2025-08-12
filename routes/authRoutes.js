// E:\Internship\Project (2)\project\server\routes\authRoutes.js

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Correctly importing middleware and controllers
const authController = require("../controllers/authControllers");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Assuming your multer setup is in a file named 'multer.js' at the server root.
// This file must correctly export a Multer instance.
const upload = require('../multer');

// --- Public Routes ---
router.post("/register", authController.register);
router.post("/login", authController.login);

// --- User Profile & Update Routes ---
router.get("/me", protect, authController.getProfile);

// Update user profile and handle avatar upload
router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const { username, email } = req.body;
    // The `protect` middleware should populate `req.user`
    const user = await authController.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    if (req.file) {
      // Deleting the old avatar if it exists
      if (user.avatar && user.avatar.startsWith("/uploads/avatars/")) {
        const oldAvatarPath = path.join(__dirname, '..', user.avatar);
        fs.unlink(oldAvatarPath, (err) => {
          if (err) console.error('Error deleting old avatar:', err);
        });
      }
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();
    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Admin Protected Routes ---
router.get("/users", protect, isAdmin, authController.getAllUsers);
router.delete("/user/:id", protect, isAdmin, authController.deleteUser);
router.put("/users/:id", protect, isAdmin, authController.updateUser);

module.exports = router;