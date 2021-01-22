
const db = require('../mysqlConnect');//Configuration information de connections mysql
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });



/* --  CREATE -- */

exports.createCommentaire = (req, res, next) => {
    const commentaire = {
        message_id: req.body.message_id,
        user_id: req.body.user_id,
        content: req.body.content,
        publication: new Date()
    }
    db.query(`INSERT INTO commentaires SET ?`, commentaire, (error, result, field) => {
    if (error) {
        return res.status(400).json(error)
    }
        console.log('création d un commentaire - ok')
        return res.status(201).json({ message: 'Votre réponse a été posté !' })
    })    
};



/* --  MODIFY  -- */

exports.modifyCommentaire = (req, res, next) => {
    const content = req.body.content
    const id = req.params.id
    console.log('nouveau texte "' + content + '" pour le commentaire ' + id)
    db.query(
        `UPDATE commentaires SET content= ? WHERE id= ?`,
        [ content, id ],
        (error, results, fields) => {
            if (error) {
            return res.status(400).json(error)
            }
            return res.status(200).json({ message: 'Votre message a bien été modifié !' })
        } 
    )
    console.log("modification commentaire numero " + id + " - ok");
};


/* --  DELETE  -- */

exports.deleteCommentaire = (req, res, next) => {
    db.query(
        'DELETE FROM commentaires WHERE id=?', 
        req.params.id, 
        (error, result, fields) => {
            if (error) {
                return res.status(400).json(error)
            }
            console.log('suppression d un commentaire - ok')
            return res.status(200).json({ message: 'Votre message a bien été supprimé !' })
        }
    )
};



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
            console.log('récupération d un commentaire - ok')
            return res.status(200).json(result)
        }
    )
};

//récupérer tous les commentaires
exports.getAllCommentaires = (req, res, next) => {
    db.query(
        'SELECT * FROM commentaires ORDER BY publication DESC', 
        (error, result, field) => {
            if (error) {
                return res.status(400).json({ error })
            }
            console.log('récupération de tous les commentaires - ok')
            return res.status(200).json(result)
        }
    )
};