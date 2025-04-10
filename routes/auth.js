/** @format */

const router = require('express').Router();
const { User } = require('../models/users');
const Joi = require('joi')
const _ = require('lodash');
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');
    
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');
    
    let token = user.generateAuthToken();
    res.send(token)

});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(40).email().required(),
    password: Joi.string().min(5).max(15).required(),
  });

  const result = schema.validate(req);
  return result;
}


module.exports = router;
