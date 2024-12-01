const Company = require('../models/Company');
const User = require('../models/User');

// Create a new company
exports.createCompany = async (req, res) => {
    if(!req.body.userId) {
        return res.status(400).send({
            message: "User ID is required in the request body"})};

    const user = await User.findById(req.body.userId)
    if(!user) {
        return res.status(404).send({
            message: "User not found with ID " + req.body.userId
        });
    } else {
        if(user.type !== 'admin') {
            return res.status(403).send({
                message: "Only admin users can create companies"
            });
        }
    }

    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).send({message: "Company created successfully", company});
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find({});
        res.status(200).send({message: "Company retrieved successfully", companies});
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).send();
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a company by ID
exports.updateCompanyById = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!company) {
            return res.status(404).send();
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a company by ID
exports.deleteCompanyById = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).send();
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(500).send(error);
    }
};
