//routeur pour signup et login des utilisateurs
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); 

// router.post('/createUsersTbl', userCtrl.createUsersTable);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/', userCtrl.getAllUsers);

//export du router
module.exports = router;