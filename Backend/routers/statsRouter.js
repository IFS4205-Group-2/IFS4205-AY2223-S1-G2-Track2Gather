const express = require('express');
const router = express.Router();
const {
  handleGetHealthAuthorityStats,
  handleGetUserStats,
  handleGetContactTracerStats,
} = require("../controllers/statsController");
const validateHealthAuthorityRole = require("../controllers/validateHealthAuthorityRole");

router.get('/healthauthority', validateHealthAuthorityRole, handleGetHealthAuthorityStats);
router.get('/user', handleGetUserStats);
router.get('/contacttracer', handleGetContactTracerStats);
module.exports = router;