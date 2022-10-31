const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const {
  handleLogin,
  attemptLogin,
} = require("../controllers/authController");
const { rateLimiter } = require("../controllers/express/rateLimiter");

router
  .route("/login")
  .get(handleLogin)
  .post(validateForm, rateLimiter(60, 10), attemptLogin); //limit of 10 attempts every 60 seconds

module.exports = router;
