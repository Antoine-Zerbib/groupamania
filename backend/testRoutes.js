exports.getAllSauce = (req, res, next) => {
    Sauce.find()// sans arguments pour récupérer la liste complète dans un promise
        .then(sauces => res.status(200).json(sauces)) 
        .catch(error => res.status(400).json({ error }));
};