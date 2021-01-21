const express = require('express');
const router = express.Router();
const commentaireCtrl = require('../controllers/commentaire');
const auth = require('../middleware/auth');

/* --commentaires -- */
router.put('/:id',  commentaireCtrl.modifyCommentaire);
router.post('/',  commentaireCtrl.createCommentaire);
router.delete('/:id', commentaireCtrl.deleteCommentaire);
router.get('/:id',  commentaireCtrl.getOneCommentaire);
router.get('/msg/:id',  commentaireCtrl.getCommentaires1Message);
router.get('/',  commentaireCtrl.getAllCommentaires);

module.exports = router;