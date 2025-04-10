/** @format */
const express = require('express')
const genreRoutes = require('../routes/genres');
const customerRoutes = require('../routes/customers');
const movieRoutes = require('../routes/movies');
const rentalRoutes = require('../routes/rentals');
const userRoutes = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');


module.exports = function (app) {
    //routes
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/api/genres', genreRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/movies', movieRoutes);
  app.use('/api/rentals', rentalRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/auth', auth);

  app.use(error);
};
