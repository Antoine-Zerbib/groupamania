//routeur pour signup et login des utilisateurs
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); 

/* -- users -- */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
// router.get('/', userCtrl.getAllUsers);
router.get('/me', userCtrl.getOneUser);

//export du router
module.exports = router;