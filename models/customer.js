/** @format */
const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, 'name must be at least 3 characters'],
    maxlength: [20, 'name must not exceed 12 characters'],
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: [3, 'name must be at least 3 characters'],
    maxlength: [12, 'name must not exceed 20 characters'],
  },
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(3).max(12).required(),
  });

  const result = schema.validate(customer);
  return result;
}

exports.Customer = Customer
exports.validate = validateCustomer