const express = require('express');
const router = express.Router();
const {
    handleGetTracingRecords,
} = require("../controllers/recordController");
  
router.get('/records', handleGetTracingRecords);


module.exports = router;