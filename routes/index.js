const express = require('express');
const userRoutes = require('./userRoutes');
const jobsRoutes = require('./jobsRoutes');
const companiesRoutes = require('./companiesRoutes');

const router = express.Router();

// Import routes

// Use routes
router.use('/users', userRoutes);
router.use('/jobs', jobsRoutes);
router.use('/companies', companiesRoutes);

module.exports = router;