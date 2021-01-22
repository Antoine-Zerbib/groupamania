
const db = require('../mysqlConnect');//Configuration information de connections mysql
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });

//import du package fs de nodes
const fs = require('fs'); //donne accès aux différentes opérations liées au système de fichier



/* --  CREATE  -- */

exports.createMessage = (req, res, next) => {
    const attachement = req.body.attachement;
    const date = new Date();
    const user_id = req.body.user_id;
    console.log("test1");
    //on rajoute une étape car le frontend ne sais pas quel est l'Url de l'image maintenant
    //car c'est notre middleware multer qui a généré ce fichier
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    console.log("imageUrl : " + imageUrl);
    const bindings = {
        user_id: user_id,
        title: req.body.title,
        content: req.body.content,
        attachement: imageUrl,
        publication: date
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

exports.modifyMessage = (req, res, next) => {
    const content = req.body.content
    const id = req.params.id
    console.log('nouveau texte "' + content + '" pour le message ' + id)
    db.query(
        `UPDATE messages SET content= ? WHERE id= ?`, [ content, id ],
        (error, results, fields) => {
            if (error) {
            return res.status(400).json(error)
            }
            return res.status(200).json({ message: 'Votre message a bien été modifié !' })
        } 
    )
    console.log("modification message numero " + id + " - ok");
};


/* --  DELETE  -- */

exports.deleteMessage = (req, res, next) => {
    const filename = message.imageUrl.split('/images/')[1]; 

    // appel d'une fonction du package 'fs' : unlink sert a supprimer un fichier
    fs.unlink(`images/${filename}`, () => {

        //on supprime d'abord les commentaires du message
        db.query(
            'DELETE FROM commentaires WHERE message_id=?', 
            req.params.id, 
            (error, result, fields) => {
                if (error) {
                    return res.status(400).json(error)
                }
                console.log('suppression des commentaires du message spécifié - ok')
            }
        )
    
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

