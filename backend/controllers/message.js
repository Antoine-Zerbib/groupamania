
const db = require('../mysqlConnect');//Configuration information de connections mysql
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });

//encodage et stockage des images
const base64ImageToFile = require('base64image-to-file');

// //import du package fs de nodes
// const fs = require('fs'); //donne accès aux différentes opérations liées au système de fichier


/* --  CREATION TABLES DB  -- */

// //Table Messages
// exports.createMessagesTable = (req, res) => {
//   let msg = 'CREATE TABLE IF NOT EXISTS `groupomania`.`messages` ( `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT, `user_id` SMALLINT UNSIGNED NOT NULL, `title` VARCHAR(50) NOT NULL, `content` TEXT NOT NULL, `attachement` VARCHAR(120) NULL DEFAULT NULL, `publication` DATETIME NOT NULL, PRIMARY KEY (`id`), INDEX `fk_userPost_numero` (`user_id` ASC) VISIBLE, FOREIGN KEY (`user_id`) REFERENCES `groupomania`.`users` (`id`)) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;'
//     db.query(msg, (err, result) => {
//     if (err) throw err
//     console.log(result)
//     res.send('la table message a été crée !')
//   });
// };

// //Table Commentaires 
// exports.createCommentairesTable = (req, res) => {
//   let com = 'CREATE TABLE IF NOT EXISTS `groupomania`.`commentaires` ( `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT, `message_id` SMALLINT UNSIGNED NULL DEFAULT NULL, `user_id` SMALLINT UNSIGNED NOT NULL, `content` TEXT NULL DEFAULT NULL, `publication` DATETIME NOT NULL, PRIMARY KEY (`id`), INDEX `fk_message_numero` (`message_id` ASC) VISIBLE, INDEX `fk_userCommentaires_numero` (`user_id` ASC) VISIBLE, CONSTRAINT `fk_message_numero` FOREIGN KEY (`message_id`) REFERENCES `groupomania`.`messages` (`id`), CONSTRAINT `fk_userCommentaires_numero` FOREIGN KEY (`user_id`) REFERENCES `groupomania`.`users` (`id`)) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;'
//     db.query(com, (err, result) => {
//     if (err) throw err
//     console.log(result)
//     res.send('la  table reponse a été crée !')
//   });
// };





/* --  MESSAGES  -- */

//POST Message
exports.createMessage = (req, res, next) => {
    const attachement = req.body.image;
    const date = new Date();
    const currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    const user_id = req.body.user_id;
    const fileName = user_id + "-" + currentDate;

    console.log("test1");
  
    // create an image with the a given name ie 'image'
    base64ImageToFile(attachement, 'tmp/', fileName, function(err) {
      if(err) {
        return console.error(err);
      }

      console.log("test2");

      const bindings = {
        user_id: user_id,
        title: req.body.title,
        content: req.body.content,
        attachement: fileName + '.gif',
        publication: date
      }

      console.log("test3");

      const sqlQuery = "INSERT INTO `messages` SET ?"
      const preparedStatement = db.format(sqlQuery, [bindings])

      console.log("test4");

      db.query(preparedStatement, (error, result, field) => {
        if (error) {
          return res.status(400).json({ error })
        }
        return res.status(201).json({ message: 'Votre message a été posté !' })
    
      })
      console.log("test5");
    });  
};

/* --  MODIFY  -- */

exports.modifyMessage = (req, res, next) => {
};


/* --  DELETE  -- */

    //pour accéder aux fichier, on va faire une importation de 'fs' (file system) L.6
exports.deleteMessage = (req, res, next) => {};


/* --  READ  -- */

// recupérer les infos d'un message
exports.getOneMessage = (req, res, next) => {
};

//récupérer tous les messages
exports.getAllMessages = (req, res, next) => {
    //WHERE idMESSAGES < 133 LIMIT 2
    db.query('SELECT * FROM messages  ORDER BY publication DESC', (error, result, field) => {
        if (error) {
            return res.status(400).json({ error })
        }
        return res.status(200).json(result)
    })
};


/* --  COMMENTAIRES  -- */

//récupérer tous les messages
exports.getAllCommentaires = (req, res, next) => {
    //WHERE idMESSAGES < 133 LIMIT 2
    db.query('SELECT * FROM commentaires  ORDER BY publication DESC', (error, result, field) => {
        if (error) {
            return res.status(400).json({ error })
        }
        return res.status(200).json(result)
    })
};