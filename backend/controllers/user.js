//package de cryptage pour les mots de passe
const bcrypt = require('bcrypt');

//package qui permet de creer des tokens et les vérifier
const jwt = require('jsonwebtoken');

const db = require('../mysqlConnect');
const dotenv = require("dotenv");
dotenv.config({path: './.env'});



/* -- CREATION TABLE USER -- */


// //Création de la table user 
// exports.createUsersTable = (req, res) => {
//     let usr = 'CREATE TABLE IF NOT EXISTS `groupomania`.`users` ( `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT, `login` VARCHAR(10) NOT NULL, `password` VARCHAR(255) NOT NULL, `email` VARBINARY(50) NOT NULL, PRIMARY KEY (`id`, `email`), UNIQUE INDEX `ind_uni_email` (`email` ASC) VISIBLE, UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE) ENGINE = InnoDB AUTO_INCREMENT = 2  DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
//     db.query(usr, (err, result) => {
//         if (err) throw err
//         console.log(result)
//         res.send('table created !')
//     });
// };



/* -- SIGNUP -- */

exports.signup = (req, res, next) => {
    const password = req.body.password; 
    bcrypt.hash(password, 10)
        .then(hash => {   
            const sqlQuery = "INSERT INTO `users` SET ?"
            const bindings = {
                login:req.body.login,
                email:req.body.email,
                password : hash 
            } 
            const preparedUserInfo = db.format(sqlQuery, [bindings])
            db.query(preparedUserInfo, (error, result, field) => {
                if (error) {
                    console.log(error)
                    return res.status(400).json("erreur")
                }
                console.log('création de compte utilisateur - ok')
                return res.status(201).json({message : 'Votre compte a bien été crée !'},)
            });
        })
        .catch(error => res.status(500).json({ error })
    );
};



/* -- LOGIN -- */

exports.login = (req, res, next) => {
    const login = req.body.login
    const password = req.body.password
    db.query(
        'SELECT * FROM users WHERE login= ?',
        login, 
        (error, results, _fields) => {
            console.log(results[0])
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password).then((valid) => {
                    if (!valid) {
                        res.status(401).json({ message: 'Utilisateur ou mot de passe inconnu' })
                    } else {
                        console.log(login, "s'est connecté")
                        res.status(200).json({
                        user_id: results[0].id,
                        token: jwt.sign({ user_id: results[0].id },process.env.TOKEN_USER,{ expiresIn: '24h' }),
                    })
                }
            })
            console.log('apres ligne 78')
        } 
       else {
            res.status(401).json({ message: 'Utilisateur ou mot de passe inconnu' })
       }
    })
};



/* -- ALL USERS -- */

exports.getAllUsers = (req, res, next) => {
    db.query('SELECT * FROM users ORDER BY id DESC', (error, result, field) => {
        if (error) {
            return res.status(400).json({ error })
        }

        //cons.log à enlever après
        console.log('récupération de tous les utilisateurs')

        return res.status(200).json(result)
    })
};