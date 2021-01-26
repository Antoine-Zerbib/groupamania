const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message');
const auth = require('../middleware/auth');

//import multer pour sauvegarder l'image, attention à bien le mettre apres 'auth'
const multer = require('../middleware/multer-config');

/* -- messages -- */
router.put('/', auth, messageCtrl.modifyMessage);
router.post('/', auth, multer, messageCtrl.createMessage);
router.delete('/', auth, messageCtrl.deleteMessage);
router.get('/', auth, messageCtrl.getAllMessages);

module.exports = router;