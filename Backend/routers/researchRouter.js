const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/research", async (req, res) => {
  try {

    const research = await pool.query("SELECT healthdata.vaccination vaccination, userdata.user_gender gender, userdata.year_of_birth yearofbirth, userdata.postal_code postal from get_all_user_data_researcher() AS userdata LEFT JOIN get_all_health_data_researcher() AS healthdata ON userdata.id = healthdata.id;");
   
    console.log("research request received");
    return res.status(200).json(research.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server error' });
  }
});


module.exports = router;