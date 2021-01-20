
const db = require('../mysqlConnect');//Configuration information de connections mysql
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });


exports.createCommentaire = (req, res, next) => {
};

/* --  MODIFY  -- */

exports.modifyCommentaire = (req, res, next) => {
};


/* --  DELETE  -- */

    //pour accéder aux fichier, on va faire une importation de 'fs' (file system) L.6
exports.deleteCommentaire = (req, res, next) => {};


/* --  READ  -- */

// recupérer un commentaire
exports.getOneCommentaire = (req, res, next) => {
    db.query(
        'SELECT * FROM commentaires WHERE id=? ORDER BY publication DESC',
        req.params.id,
        (error, result, field) => {
            if (error) {
                return res.status(400).json({ error })
            }
    
            //à supprimer apres
            console.log('récupération d un commentaire - ok')
    
            return res.status(200).json(result)
        }
    )
};

// recupérer les commentaires d'un message
exports.getCommentaires1Message = (req, res, next) => {
    db.query(
        'SELECT * FROM commentaires WHERE message_id=? ORDER BY publication DESC',
        req.params.id,
        (error, result, field) => {
            if (error) {
                return res.status(400).json({ error })
            }
    
            //à supprimer apres
            console.log('récupération d un commentaire - ok')
    
            return res.status(200).json(result)
        }
    )
};

//récupérer tous les messages
exports.getAllCommentaires = (req, res, next) => {
    db.query(
        'SELECT * FROM commentaires ORDER BY publication DESC', 
        (error, result, field) => {
            if (error) {
                return res.status(400).json({ error })
            }
    
            //à supprimer apres
            console.log('récupération de tous les commentaires - ok')
    
            return res.status(200).json(result)
        }
    )
};