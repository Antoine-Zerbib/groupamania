const express = require('express');
const router = express.Router();
const commentaireCtrl = require('../controllers/commentaire');
const auth = require('../middleware/auth');

/* --commentaires -- */
router.put('/:id', auth, commentaireCtrl.modifyCommentaire);
router.post('/', auth, commentaireCtrl.createCommentaire);
router.delete('/:id', auth, commentaireCtrl.deleteCommentaire);
router.get('/:id',  commentaireCtrl.getOneCommentaire);
router.get('/msg/:id',  commentaireCtrl.getCommentaires1Message);
router.get('/',  commentaireCtrl.getAllCommentaires);

module.exports = router;