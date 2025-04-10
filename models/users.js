const mongoose = require('mongoose')
const Joi = require('joi')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config');

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token
}

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(50).required(),
      email: Joi.string().min(3).max(40).email().required(),
      password: Joi.string().min(5).max(15).required(),
    });

    const result = schema.validate(user)
    return result
}

exports.userSchema = userSchema
exports.User = User
exports.validate = validateUser