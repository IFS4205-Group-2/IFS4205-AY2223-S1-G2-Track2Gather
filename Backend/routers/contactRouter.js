const express = require('express');
const router = express.Router();
const {
 handleGetContact,
} = require("../controllers/contactController");
const validateContactTracerRole = require("../controllers/validateContactTracerRole");
router.get('/contacts', validateContactTracerRole, handleGetContact);

module.exports = router;