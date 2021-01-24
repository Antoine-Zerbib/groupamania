const bcrypt = require('bcrypt');

//package qui permet de creer des tokens et les vérifier
const jwt = require('jsonwebtoken');
const db = require('../mysqlConnect');
const dotenv = require("dotenv");
dotenv.config({path: './.env'});
const fs = require('fs'); 



/* -- SIGNUP -- */

exports.signup = (req, res, next) => {
    const password = req.body.password; 
    const username = req.body.username;
    bcrypt.hash(password, 10)
        .then(hash => {   
            const sqlQuery = "INSERT INTO `users` SET ?"
            const bindings = {
                username:username,
                email:req.body.email,
                password : hash 
            } 
            const preparedUserInfo = db.format(sqlQuery, [bindings])
            db.query(preparedUserInfo, (error, result, field) => {
                if (error) {
                    console.log(error)
                    return res.status(400).json("erreur")
                }
                console.log('création de compte utilisateur : ' + username)
                return res.status(201).json({message : 'Votre compte a bien été crée !'},)
            });
        })
        .catch(error => res.status(500).json({ error })
    );
};



/* -- LOGIN -- */

exports.login = (req, res, next) => {
    const password = req.body.password
    const username = req.body.username;
    db.query(
        'SELECT * FROM users WHERE username= ?',
        username, 
        (error, results, _fields) => {
            console.log(results[0])
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password).then((valid) => {
                    if (!valid) {
                        res.status(401).json({ message: 'Utilisateur ou mot de passe inconnu' })
                    } else {
                        console.log(username, "s'est connecté")
                        res.status(200).json({
                        id: results[0].id,
                        token: jwt.sign({ user_id: results[0].id },process.env.TOKEN_USER,{ expiresIn: '24h' }),
                    })
                }
            })
        } 
       else {
            res.status(401).json({ message: 'Utilisateur ou mot de passe inconnu' })
       }
    })
};


/* -- ONE USER -- */

exports.getOneUser = (req, res, next) => {
    db.query('SELECT * FROM users WHERE id= ? ', req.params.id, (error, result, field) => {
        if (error) {
            return res.status(400).json({ error })
        }
        console.log('récupération d un utilisateur')
        return res.status(200).json(result)
    })
};


/* --  DELETE  -- */


exports.deleteUser = (req, res, next) => {

    filename = (req, res, next) => {
        
        //récupération de l'Url de l'image à supprimer
        db.query(
            'SELECT imageUrl FROM messages WHERE user_id=? ',
            req.params.id, 
            (error, result, fields) => {
                if (error) {
                    return res.status(400).json(error)
                }
                console.log('sélection des url images pour suppression')
            }
        )
    }

    // appel d'une fonction du package 'fs' : unlink sert a supprimer un fichier
    fs.unlink(`images/${filename}`, () => {

        //on supprime d'abord les messages
        db.query(
            'DELETE FROM messages WHERE user_id=?', 
            req.params.id, 
            (error, result, fields) => {
                if (error) {
                    return res.status(400).json(error)
                }
                console.log('suppression des messages de l utilisateur')
            }
        )
        
        //enfin on supprime l utilisateur
        db.query(
            'DELETE FROM users WHERE id=?', 
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



// /* -- ALL USERS -- */

// exports.getAllUsers = (req, res, next) => {
//     db.query('SELECT * FROM users ORDER BY id DESC', (error, result, field) => {
//         if (error) {
//             return res.status(400).json({ error })
//         }
//         console.log('récupération de tous les utilisateurs')
//         return res.status(200).json(result)
//     })
// };







