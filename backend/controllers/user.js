const bcrypt = require('bcrypt');

//package qui permet de creer des tokens et les vérifier
const jwt = require('jsonwebtoken');
const db = require('../mysqlConnect');
const dotenv = require("dotenv");
dotenv.config({path: './.env'});




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
                console.log('création de compte utilisateur - ok')
                console.log(username, "s'est connecté")
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
                        user_id: results[0].id,
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


/* -- ONE USER -- */

exports.getOneUser = (req, res, next) => {
    db.query('SELECT * FROM users WHERE id= ? ', req.body.id, (error, result, field) => {
        if (error) {
            return res.status(400).json({ error })
        }
        console.log('récupération d un utilisateur')
        return res.status(200).json(result)
    })
};
