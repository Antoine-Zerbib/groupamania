const { json } = require('body-parser');

//modif controller SQL ont lieu sur les modèles
const Post = require('../models/Post');

//import du package fs de nodes
const fs = require('fs'); //donne accès aux différentes opérations liées au système de fichier


/* --  CREATE  -- */

exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post); 
    delete postObject._id;
    const post = new Post({
        ...postObject,

        //on rajoute une étape car le frontend ne sais pas quel est l'Url de l'image maintenant
        //car c'est notre middleware multer qui a généré ce fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

    });

    post.save() 
        .then(() => res.status(201).json({ message : 'Objet enregistré !'})) 
        .catch(error => res.status(400).json({ error })); 
};

/* --  MODIFY  -- */

exports.modifyPost = (req, res, next) => {

    //test pour savoir dans quel cas de figure on se trouve
    const postObject = req.file ?// '?' opérateur ternaire => savoir si il existe
    { 
        ...JSON.parse(req.body.post),  //récupérer les infos sur l'objet dans cette partie de la requête

        //et on génère l'imageUrl
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    
    Post.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


/* --  DELETE  -- */

    //pour accéder aux fichier, on va faire une importation de 'fs' (file system) L.6
exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id }) 

        //dans le callback on récupère un 'post'
        //avec laquelle on veut récupérer non pas l'url, mais le nom précis du fichier
        .then(post => {
            const filename = post.imageUrl.split('/images/')[1]; 

            // appel d'une fonction du package 'fs' : unlink sert a supprimer un fichier
            fs.unlink(`images/${filename}`, () => {

                // une fois supprimé on veut enlever le 'Thing de la base de données
                Post.deleteOne({ _id: req.params.id }) 
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }); 
        })
        .catch(error => res.status(500).json({ error }));  //500 erreur server
};


/* --  READ  -- */

// recupérer les infos d'une post
exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post)) 
        .catch(error => res.status(404).json({ error })); 
};

//récupérer tous les posts
exports.getAllPost = (req, res, next) => {
    Post.find()// sans arguments pour récupérer la liste complète dans un promise
        .then(posts => res.status(200).json(posts)) 
        .catch(error => res.status(400).json({ error }));
};


