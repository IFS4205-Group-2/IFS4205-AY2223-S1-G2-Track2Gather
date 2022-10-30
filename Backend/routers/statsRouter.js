const express = require('express');
const router = express.Router();
const {
  handleGetHealthAuthorityStats,
  handleGetUserStats,
} = require("../controllers/statsController");
const validateHealthAuthorityRole = require("../controllers/validateHealthAuthorityRole");

router.get('/healthauthority', validateHealthAuthorityRole, handleGetHealthAuthorityStats);
router.get('/user', handleGetUserStats);
module.exports = router;