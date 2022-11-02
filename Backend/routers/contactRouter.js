const express = require('express');
const router = express.Router();
const {
 handleGetContact,
} = require("../controllers/contactController");

router.get('/contacts', handleGetContact);

module.exports = router;