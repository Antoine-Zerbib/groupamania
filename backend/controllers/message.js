const { json } = require('body-parser');
 const Message = require('../models/Message');

//import du package fs de nodes
const fs = require('fs'); //donne accès aux différentes opérations liées au système de fichier


/* --  CREATE  -- */

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,

        //on rajoute une étape car le frontend ne sais pas quel est l'Url de l'image maintenant
        //car c'est notre middleware multer qui a généré ce fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

       
    });

    sauce.save() 
        .then(() => res.status(201).json({ message : 'Objet enregistré !'})) 
        .catch(error => res.status(400).json({ error })); 
};

/* --  MODIFY  -- */

exports.modifySauce = (req, res, next) => {

    //test pour savoir dans quel cas de figure on se trouve
    const sauceObject = req.file ?// '?' opérateur ternaire => savoir si il existe
    { 
        ...JSON.parse(req.body.sauce),  //récupérer les infos sur l'objet dans cette partie de la requête

        //et on génère l'imageUrl
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


/* --  DELETE  -- */

    //pour accéder aux fichier, on va faire une importation de 'fs' (file system) L.6
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 

        //dans le callback on récupère une 'sauce'
        //avec laquelle on veut récupérer non pas l'url, mais le nom précis du fichier
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; 

            // appel d'une fonction du package 'fs' : unlink sert a supprimer un fichier
            fs.unlink(`images/${filename}`, () => {

                // une fois supprimé on veut enlever le 'Thing de la base de données
                Sauce.deleteOne({ _id: req.params.id }) 
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }); 
        })
        .catch(error => res.status(500).json({ error }));  //500 erreur server
};


/* --  READ  -- */

// recupérer les infos d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce)) 
        .catch(error => res.status(404).json({ error })); 
};

//récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()// sans arguments pour récupérer la liste complète dans un promise
        .then(sauces => res.status(200).json(sauces)) 
        .catch(error => res.status(400).json({ error }));
};
