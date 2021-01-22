const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message');
const auth = require('../middleware/auth');

//import multer pour sauvegarder l'image, attention à bien le mettre apres 'auth'
const multer = require('../middleware/multer-config');

/* -- messages -- */
router.put('/:id',  messageCtrl.modifyMessage);
router.post('/', multer, messageCtrl.createMessage);
router.delete('/:id',  messageCtrl.deleteMessage);
router.get('/:id', auth, messageCtrl.getOneMessage);
router.get('/', auth, messageCtrl.getAllMessages);

module.exports = router;