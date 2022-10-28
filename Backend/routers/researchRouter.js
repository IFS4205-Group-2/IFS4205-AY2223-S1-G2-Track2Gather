const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/researchdata", async (req, res) => {
  try {
    
    const research = await pool.query("SELECT us.gender gender, us.date_of_birth birthday, mh.vaccination_history vaccination, mh.recent_test_result testresult FROM medicalhistories mh LEFT JOIN users us ON us.uid = mh.uid;");
    console.log("research request received");
    return res.status(200).json(research.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server error' });
  }
});


module.exports = router;