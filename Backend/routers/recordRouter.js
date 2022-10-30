const express = require('express');
const handleGetTracingRecords = require('../controllers/recordController');
const router = express.Router();

router.get('/records', handleGetTracingRecords);
module.exports = router;