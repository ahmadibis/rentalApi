function admin(req, res, next) {
    //forbidden
    //req.user from the first middleware we check for the isAdmin property
    if (!req.user.isAdmin) return res.status(403).send('Access denied')
    next()
}

module.exports = admin