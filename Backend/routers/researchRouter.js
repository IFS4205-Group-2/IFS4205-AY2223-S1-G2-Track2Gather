const express = require('express');
const router = express.Router();

const {
  handleGetResearchData,
} = require("../controllers/researchController");
const validateResearcherRole = require("../controllers/validateResearcherRole");

router.get('/research', validateResearcherRole, handleGetResearchData);

module.exports = router;