
const db = require('../mysqlConnect');//Configuration information de connections mysql
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });


/* --  CREATION TABLES COMMENTAIRES  -- */

// exports.createCommentairesTable = (req, res) => {
//   let com = 'CREATE TABLE IF NOT EXISTS `groupomania`.`commentaires` ( `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT, `message_id` SMALLINT UNSIGNED NULL DEFAULT NULL, `user_id` SMALLINT UNSIGNED NOT NULL, `content` TEXT NULL DEFAULT NULL, `publication` DATETIME NOT NULL, PRIMARY KEY (`id`), INDEX `fk_message_numero` (`message_id` ASC) VISIBLE, INDEX `fk_userCommentaires_numero` (`user_id` ASC) VISIBLE, CONSTRAINT `fk_message_numero` FOREIGN KEY (`message_id`) REFERENCES `groupomania`.`messages` (`id`), CONSTRAINT `fk_userCommentaires_numero` FOREIGN KEY (`user_id`) REFERENCES `groupomania`.`users` (`id`)) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;'
//     db.query(com, (err, result) => {
//     if (err) throw err
//     console.log(result)
//     res.send('la  table reponse a été crée !')
//   });
// };



/* --  CREATE -- */

exports.createCommentaire = (req, res, next) => {
    const commentaire = {
        message_id: req.body.message_id,
        user_id: req.body.user_id,
        content: req.body.content,
        publication: new Date()
    }
    console.log(commentaire);

    db.query(`INSERT INTO commentaires SET ?`, commentaire, (error, result, field) => {
    if (error) {
        return res.status(400).json(error)
    }

        //à supprimer apres
        console.log('création d un commentaire - ok')
    

        return res.status(201).json({ message: 'Votre réponse a été posté !' })
    })    
};



/* --  MODIFY  -- */

exports.modifyCommentaire = (req, res, next) => {
    const content = req.body.content
    const id = req.body.id
    console.log(content)
    console.log(id)
        db.query(
        `UPDATE commentaires SET content='${content}' WHERE id=${id}`,
        (error, results, fields) => {
            if (error) {
            return res.status(400).json(error)
            }
            
            //à supprimer apres
            console.log('modification dun commentaire - ok')

            return res.status(200).json({ message: 'Votre message a bien été modifié !' })
        } 
    )
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
            
            //à supprimer apres
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

//récupérer tous les commentaires
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