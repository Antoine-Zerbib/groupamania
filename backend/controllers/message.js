
const db = require('../mysqlConnect');//Configuration information de connections mysql
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });

//import du package fs de nodes
const fs = require('fs'); //donne accès aux différentes opérations liées au système de fichier



/* --  CREATE  -- */

exports.createMessage = (req, res, next) => {
    console.log("début création message");

    //on rajoute une étape car le frontend ne sais pas quel est l'Url de l'image maintenant
    //car c'est notre middleware multer qui a généré ce fichier
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    console.log("imageUrl : " + imageUrl);
    const bindings = {
        user_id: req.body.id,
        content: req.body.content,
        attachement: imageUrl,
        publication: new Date()
    }
    const sqlQuery = "INSERT INTO `messages` SET ?"
    const preparedStatement = db.format(sqlQuery, [bindings])
    db.query(preparedStatement, (error, result, field) => {
        if (error) {
        return res.status(400).json({ error })
        }
        return res.status(201).json({ message: 'Votre message a été posté !' })
    }) 
    console.log("insertion message réussie");
};


/* --  MODIFY  -- */

// exports.modifyMessage = (req, res, next) => {
//     const content = req.body.content
//     const id = req.params.id
//     console.log('nouveau texte "' + content + '" pour le message ' + id)
//     db.query(
//         `UPDATE messages SET content= ? WHERE id= ?`, [ content, id ],
//         (error, results, fields) => {
//             if (error) {
//             return res.status(400).json(error)
//             }
//             return res.status(200).json({ message: 'Votre message a bien été modifié !' })
//         } 
//     )
//     console.log("modification message numero " + id + " - ok");
// };


/* --  DELETE  -- */

exports.deleteMessage = (req, res, next) => {
    filename = (req, res, next) => {
        //récupération de l'Url de l'image à supprimer
        db.query(
            'SELECT imageUrl FROM messages WHERE id=? ',
            req.params.id, 
            (error, result, fields) => {
                if (error) {
                    return res.status(400).json(error)
                }
                console.log('sélection de l image à supprimer')
            }
        )
    }

    // appel d'une fonction du package 'fs' : unlink sert a supprimer un fichier
    fs.unlink(`images/${filename}`, () => {

        db.query(
            'DELETE FROM messages WHERE id=?', 
            req.params.id, 
            (error, result, fields) => {
                if (error) {
                    return res.status(400).json(error)
                }            
                console.log('suppression d un message spécifique - ok')
                return res.status(200).json({ message: 'Votre message a bien été supprimé !' })
            }
        )
    })
};


/* --  READ  -- */

// recupérer les infos d'un message
exports.getOneMessage = (req, res, next) => {
    db.query(
        'SELECT* FROM messages WHERE id=? ',
        req.params.id,
        (error, result, field) => {
            if (error) {
                return res.status(400).json({ error })
            }
            console.log('récupération d un message spécifique - ok')
            return res.status(200).json(result)
        }
    )
};

//récupérer tous les messages
exports.getAllMessages = (req, res, next) => {
    db.query('SELECT * FROM messages  ORDER BY publication DESC', (error, result, field) => {
        if (error) {
            return res.status(400).json({ error })
        }
        console.log('récupération de tous les messages - ok')
        return res.status(200).json(result)
    })
};
