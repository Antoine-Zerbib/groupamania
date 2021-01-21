const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message');
const auth = require('../middleware/auth');

//import multer pour sauvegarder l'image, attention à bien le mettre apres 'auth'
const multer = require('../middleware/multer-config');

//direction, où l'on met le middleware

/* -- messages -- */
router.put('/:id',  messageCtrl.modifyMessage);
router.post('/', multer, messageCtrl.createMessage);
router.delete('/:id', messageCtrl.deleteMessage);
router.get('/:id', messageCtrl.getOneMessage);
router.get('/', messageCtrl.getAllMessages);

module.exports = router;