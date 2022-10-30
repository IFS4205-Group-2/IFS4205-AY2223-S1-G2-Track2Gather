const express = require('express');
const router = express.Router();
const pool = require('../db2');

router.get("/records", async (req, res) => {
  try {
    
    const records = await pool.query("SELECT tr.tokenid AS tokenid1, tr.time AS time1, tr.location AS location1, tr2.tokenid AS tokenid2, tr2.time AS time2 FROM tracingrecords tr LEFT JOIN tracingrecords tr2 ON tr.location = tr2.location AND tr.tokenid <> tr2.tokenid WHERE tr2.time - tr.time < interval '30 seconds' AND tr2.time - tr.time > interval '0 seconds';");
    console.log("records request received");
    return res.status(200).json(records.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server error' });
  }
});

module.exports = router;