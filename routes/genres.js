const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const {Genre,validate} = require('../models/genre');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId')

router.get(
  '/',
  async (req, res) => {
      const genre = await Genre.find().limit(10);
      res.send(genre);
  })

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404).send('not found');
    return;
  }
  res.send(genre);
});

router.post('/', auth , async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const genre = new Genre({
    name: req.body.name,
  });

  const result = await genre.save();
  res.send(result).status(201);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
      },
    },
    { new: true },
  );
  if (!genre) {
    res.status(404).send('genre with this id does not exist');
    return;
  }

  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  let genre = await Genre.findByIdAndDelete( req.params.id)
  if (!genre) {
    res.status(404).send('not found');
    return;
  }

  res.send(genre);
});

module.exports = router