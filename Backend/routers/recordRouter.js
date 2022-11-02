const express = require('express');
const router = express.Router();
const {
  handleGetTracingRecords,
} = require("../controllers/recordsController");

router.get('/records', handleGetTracingRecords);

module.exports = router;