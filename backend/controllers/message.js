
const db = require('../mysqlConnect');//Configuration information de connections mysql
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });

//encodage et stockage des images
const base64ImageToFile = require('base64image-to-file');

//import du package fs de nodes
const fs = require('fs'); //donne accès aux différentes opérations liées au système de fichier



//POST Message
exports.createMessage = (req, res, next) => {
    const attachement = req.body.image;
    const date = new Date();
    // const currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    const user_id = req.body.user_id;
  

    //on rajoute une étape car le frontend ne sais pas quel est l'Url de l'image maintenant
    //car c'est notre middleware multer qui a généré ce fichier
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    console.log("test1: imageUrl" + imageUrl);

    const bindings = {
        user_id: user_id,
        title: req.body.title,
        content: req.body.content,
        attachement: imageUrl,
        publication: date
    }

    console.log("test2 bindings" + bindings);

    const sqlQuery = "INSERT INTO `messages` SET ?"
    const preparedStatement = db.format(sqlQuery, [bindings])

    db.query(preparedStatement, (error, result, field) => {
        if (error) {
        return res.status(400).json({ error })
        }
        return res.status(201).json({ message: 'Votre message a été posté !' })
    
    }) 
    console.log("test4: insertion commentaire réussie");
     
};

/* --  MODIFY  -- */

exports.modifyMessage = (req, res, next) => {
    
    const content = req.body.content
    const id = req.body.id
    console.log(content)
    console.log(id)
        db.query(
        `UPDATE messages SET content='${content}' WHERE id=${id}`,
        (error, results, fields) => {
            if (error) {
            return res.status(400).json(error)
            }
            return res.status(200).json({ message: 'Votre message a bien été modifié !' })
        } 
    )
};


/* --  DELETE  -- */

exports.deleteMessage = (req, res, next) => {
   
    //on supprime d'abord les commentaires du message
    db.query(
        'DELETE FROM commentaires WHERE message_id=?', 
        req.params.id, 
        (error, result, fields) => {
            if (error) {
                return res.status(400).json(error)
            }
            //à supprimer apres
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
            //à supprimer apres
            console.log('suppression d un message spécifique - ok')

            return res.status(200).json({ message: 'Votre message a bien été supprimé !' })
        }
    )
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
            //à supprimer apres
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
        //à supprimer apres
        console.log('récupération de tous les messages - ok')

        return res.status(200).json(result)
    })
};

