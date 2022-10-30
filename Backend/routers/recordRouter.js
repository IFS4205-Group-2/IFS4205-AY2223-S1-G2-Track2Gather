const express = require('express');
const handleGetTracingRecords = require('../controllers/recordController');
const router = express.Router();

router.get('/records', validateContactTracerRole, handleGetTracingRecords);
module.exports = router;