const router = require('express').Router()
const { default: mongoose } = require('mongoose');
const { Movies, validate } = require('../models/movies')
const {Genre} = require('../models/genre')

router.get('/', async (req, res) => {
    const movies = await Movies.find().sort('title')
    res.status(200).send(movies);
})

router.get('/:id', async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404).send('Invalid objectId')
        return
    }
    const movie = await Movies.findById(req.params.id)
    if (!movie) {
        res.status(404).send('Movie does not exist')
        return
    }
    res.status(200).send(movie)
});

router.post('/', async (req, res) => {
    //get the request and validate 
    //if any issue dont write in db bad request
    //else write it
    const { error } = validate(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }

    //since its embedded you want a reference to the genre exists in our db
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Invalid genre')
    const movie = new Movies({
      title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    const result = await movie.save()
    res.status(201).send(result)
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const movie = await Movies.updateOne(
      { _id: req.params.id },
      {
        $set: {
              title: req.body.title,
            //updating the embedded document directly within the parent doc
          'genre.name': req.body.genre.name,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
      },
    );

    res.status(200).send(movie)
})



module.exports = router