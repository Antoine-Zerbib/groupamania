const express = require('express');

//création d'un router
const router = express.Router();

const postCtrl = require('../controllers/post');

//import de l'authentificateur pour vérifier ll'auth avant de controler
const auth = require('../middleware/auth');

//import multer pour sauvegarder l'image, attention à bien le mettre apres 'auth'
const multer = require('../middleware/multer-config');

//direction, où l'on met le middleware
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.post('/', auth, multer, postCtrl.createPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/:id', auth, postCtrl.getOnePost);
router.get('/', auth, postCtrl.getAllPost);


module.exports = router;