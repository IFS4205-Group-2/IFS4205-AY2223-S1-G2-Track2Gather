const express = require('express');
const router = express.Router();

const {
  handleGetTracingRecords,
} = require("../controllers/recordsController");
const validateContactTracerRole = require("../controllers/validateContactTracerRole");

router.get('/records', validateContactTracerRole, handleGetTracingRecords);

module.exports = router;