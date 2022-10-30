const express = require('express');
const validateUpdateUserInfoForm = require('../controllers/validateUpdateUserInfoForm');
const validateAccountInfoForm = require('../controllers/validateAccountInfoForm');
const validateAdminUpdateUserInfoForm = require('../controllers/validateAdminUpdateUserInfoForm');
const router = express.Router();
const {
  handleUserInfoUpdate,
  handleGetUserInfo,
  handleGetUserRole,
  handleAddUser,
  handleGetAllUserInfo,
  handleDeleteUser,
  handleAdminUserInfoUpdate,
} = require("../controllers/userController");
const validateHealthAuthorityRole = require("../controllers/validateHealthAuthorityRole");

router.post('/update', validateUpdateUserInfoForm, handleUserInfoUpdate);
router.post('/admin/update', validateHealthAuthorityRole, validateAdminUpdateUserInfoForm, handleAdminUserInfoUpdate);
router.post('/delete', validateHealthAuthorityRole, handleDeleteUser);
router.post('/add', validateHealthAuthorityRole, validateAccountInfoForm, handleAddUser);
router.get('/info', handleGetUserInfo);
router.get('/infos', validateHealthAuthorityRole, handleGetAllUserInfo);
router.get('/role', handleGetUserRole);
module.exports = router;