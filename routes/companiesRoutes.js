const express = require('express');
const companyController = require('../controllers/companyController');

const router = express.Router();

// Create a new job
router.post('/', companyController.createCompany);

// Retrieve all jobs
router.get('/', companyController.getAllCompanies);

// Retrieve a single job by id
router.get('/:id', companyController.getCompanyById);

// Update a job by id
router.put('/:id', companyController.updateCompanyById);

// Delete a job by id
router.delete('/:id', companyController.deleteCompanyById);

module.exports = router;