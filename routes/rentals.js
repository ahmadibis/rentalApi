const router = require('express').Router()
const { Rental, validate } = require('../models/rentals')
const { Movies } = require('../models/movies');
const { Customer } = require('../models/customer')
const auth = require('../middleware/auth');
const { default: mongoose } = require('mongoose');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    res.send(rentals);

})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer');
    
    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie');
    
    if (movie.numberInStock === 0) return res.status(400).send('Movie not available')

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    async function addRental() {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
          await rental.save({ session });
          await movie.updateOne({ $inc: { numberInStock: -1 } }, { session });
          await session.commitTransaction();
          session.endSession();
          console.log('Successful transaction');
          res.send(rental);
        } catch (error) {
          await session.abortTransaction();
          console.error('Transaction failed:', error.message);
        } finally {
          session.endSession();
        }
    }
    addRental();

})

module.exports = router