const express = require('express');
const jobsController = require('../controllers/jobsController');

const router = express.Router();

// Create a new job
router.post('/', jobsController.createJob);

// Retrieve all jobs
router.get('/', jobsController.getAllJobs);

// Retrieve a single job by id
router.get('/:id', jobsController.getJobById);

// Update a job by id
router.put('/:id', jobsController.updateJob);

// Delete a job by id
router.delete('/:id', jobsController.deleteJob);

module.exports = router;