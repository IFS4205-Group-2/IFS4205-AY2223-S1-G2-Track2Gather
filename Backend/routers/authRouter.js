const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const {
  handleLogin,
  attemptLogin,
  attemptRegister,
} = require("../controllers/authController");
const { rateLimiter } = require("../controllers/express/rateLimiter");

router
  .route("/login")
  .get(handleLogin)
  .post(validateForm, rateLimiter(60, 10), attemptLogin); //limit of 10 attempts every 60 seconds
router.post("/signup", validateForm, rateLimiter(30, 4), attemptRegister); //limit of 4 attempts every 30 seconds

module.exports = router;
