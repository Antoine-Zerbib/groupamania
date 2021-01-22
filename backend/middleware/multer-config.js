/*
Pour faciliter la gestion de fichiers envoyés avec des requêtes HTTP vers notre API
on utilise un package 'multer'

du coup on va créer un middleware qui va configurer 'multer' pour lui expliquer 
    -comment gérer les fichiers
    -où les enregister
    -quel nom de fichier leur donner
*/

//import de multer
const multer = require('multer'); 
const MIME_TYPES = {
    'images/gif': 'gif,',
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png'    
};
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => { 
        callback(null, 'images') 
        console.log('destination multer')
    },
    filename: (req, file, callback) => {
        console.log('filename multer')

        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimitype]; 
        callback(null, name + Date.now() + '.' + extension); 
        
    }
})

module.exports = multer({ storage }).single('image');

