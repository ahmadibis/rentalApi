const router = require('express').Router()
const mongoose = require('mongoose')
const {Customer, validate} = require('../models/customer') 


router.get('/', async (req, res) => {
    const customers = await Customer.find()
    res.send(customers);
})

router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.send('❌ Invalid ID: User does not exist, Register user?');
      return 
    }
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        res.status(404).send("User does not exist Register user?")
        return
    }
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.send('❌ Invalid ID: User does not exist');
      return;
    }

    const { error } = validate(req.body);
    
    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
      $set: {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
    }, { new: true });

    if (!customer) {
        res.status(404).send("user not found")
        return
    }
    
    res.send(customer)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.send(error.details[0].message)
        return
    }
    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })

    const result = await customer.save()
    res.send(result._id).status(200)
})

router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.send('❌ Invalid ID: User does not exist');
      return;
    }
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) {
        res.status(404).send('user does not exist')
        return
    }
    res.status(200).send(customer);
})

module.exports = router