const router = require('express').Router()
const auth = require('../middleware/auth')
const { User, validate } = require('../models/users')
const _ = require('lodash')


router.get('/me', auth, async (req, res) => {
    //coming from the jwt we added(decoded) to our req in the auth
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

router.post('/', async (req, res) => {
    
    const { error } = validate(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already exist');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    
    await user.save()
    let token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = router