const express = require('express');
const router = express.Router();
const commentaireCtrl = require('../controllers/commentaire');
const auth = require('../middleware/auth');

/* --commentaires -- */
router.put('/:id', auth, commentaireCtrl.modifyCommentaire);
router.post('/', commentaireCtrl.createCommentaire);
router.delete('/:id', auth, commentaireCtrl.deleteCommentaire);
router.get('/:id', auth, commentaireCtrl.getOneCommentaire);
router.get('/msg/:id', auth, commentaireCtrl.getCommentaires1Message);
router.get('/', auth, commentaireCtrl.getAllCommentaires);

module.exports = router;