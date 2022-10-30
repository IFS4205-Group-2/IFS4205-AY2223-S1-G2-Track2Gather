const express = require('express');
const router = express.Router();
const {
  handleGetTokenInfo,
  handleDeleteTokenInfo,
  handleAddTokenInfo,
} = require("../controllers/tokenController");
const validateHealthAuthorityRole = require("../controllers/validateHealthAuthorityRole");
const validateTokenInfoForm = require("../controllers/validateTokenInfoForm");

router.get('/info', validateHealthAuthorityRole, handleGetTokenInfo);
router.post('/delete', validateHealthAuthorityRole, handleDeleteTokenInfo);
router.post('/add', validateHealthAuthorityRole, validateTokenInfoForm, handleAddTokenInfo);
module.exports = router;