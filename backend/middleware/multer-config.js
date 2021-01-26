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
    'image/gif': 'gif',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'    
};
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => { 
         console.log('destination multer')
         callback(null, 'images') 
       
    },
    filename: (req, file, callback) => {
        console.log('filename multer')
       


        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; 
        console.log('file test2 ' + JSON.stringify(file))
     

        callback(null, name + Date.now() + '.' + extension); 
        
    }
})

module.exports = multer({ storage }).single('image');

