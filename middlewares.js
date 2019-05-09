module.exports = {
    capital : function (req, res, next) {
        req.body.name.charAt(0) === req.body.name.charAt(0).toUpperCase() ? next() : req.body.name.charAt(0).toUpperCase()
        let newName = `${req.body.name.charAt(0).toUpperCase()}${req.body.name.slice(1)}`;
        req.upperCase = newName
        next();
    }
}