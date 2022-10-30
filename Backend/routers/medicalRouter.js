const express = require('express');
const router = express.Router();
const validateUpdateTestResultForm = require('../controllers/validateUpdateTestResultForm');
const {
  handleUpdateMedicalInfo,
  handleGetMedicalInfo
} = require("../controllers/medicalController");

router.post('/update', validateUpdateTestResultForm, handleUpdateMedicalInfo);
router.get('/info', handleGetMedicalInfo);
module.exports = router;