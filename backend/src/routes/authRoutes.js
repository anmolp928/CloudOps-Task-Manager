const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  profile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");


// Signup Route
router.post("/signup", signup);


// Login Route
router.post("/login", login);


// Protected Profile Route
router.get(
  "/profile",
  authMiddleware,
  profile
);


module.exports = router;