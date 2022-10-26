const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/contacts", async (req, res) => {
  try {
    
    const contacts = await pool.query("SELECT name, contact_no, email, gender, zipcode, tid FROM users;");
    console.log("contacts request received");
    return res.status(200).json(contacts.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server error' });
  }
});

router.get("/records", async (req, res) => {
  try {
    
    const records = await pool.query("SELECT name, email, contact_no FROM users;");
    console.log("records request received");
    return res.status(200).json(records.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server error' });
  }
});



module.exports = router;