const express = require('express');

//création d'un router
const router = express.Router();

const messageCtrl = require('../controllers/message');

//import de l'authentificateur pour vérifier ll'auth avant de controler
const auth = require('../middleware/auth');

//import multer pour sauvegarder l'image, attention à bien le mettre apres 'auth'
const multer = require('../middleware/multer-config');

//direction, où l'on met le middleware
router.put('/:id', auth, multer, messageCtrl.modifyMessage);
router.post('/', auth, multer, messageCtrl.createMessage);
router.delete('/:id', auth, messageCtrl.deleteMessage);
router.get('/:id', auth, messageCtrl.getOneMessage);
router.get('/', auth, messageCtrl.getAllMessage);


module.exports = router;