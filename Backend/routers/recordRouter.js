const express = require('express');
const router = express.Router();
const pool = require('../db2');

router.get("/records", async (req, res) => {
  try {
    
    const records = await pool.query("SELECT tokenID, time, location FROM TracingRecords;");
    console.log("records request received");
    return res.status(200).json(records.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server error' });
  }
});



module.exports = router;