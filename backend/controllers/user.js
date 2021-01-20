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
                password = hash 
                db.query(`INSERT INTO users SET ?`, users, (err, result, field) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json("erreur")
                    }

                    //à supprimer après
                    console.log('création de compte utilisateur - ok')

                    return res.status(201).json({message : 'Votre compte a bien été crée !'},)
                });
            })
        .catch(error => res.status(500).json({ error }));
};


/* -- LOGIN -- */

exports.login = (req, res, next) => {

    //trouver User dans la base de données (adresse e-mail rentrée par l'utilisateur)
    User.findOne({ email: req.body.email })
        .then(user => {

            //si on a pas trouvé de user
            if(!user){
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            //utilisation de bcrypt pour comparer les mdp
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {

                    // si c'est faux, error
                    if (!valid){
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }

                    //si c'est vrai, renvoyer un user id et un token
                    res.status(200).json({
                        userId: user._id,

                        //utilisation de jwt => permet de creer des tokens et les vérifier
                        /*'TOKEN'*/ //au lieu d'une simple chaine de caractères, on va appeler une fonction
                        token: jwt.sign(

                            //les données que l'on veut encoder dans le token (payLoad)
                            { userId: user._id },

                            // clef secrète pour le codage créée par jwt caché en gitignore dans '.env'
                            'env.TOKEN_USER',

                            //argument de configuration
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
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