const Company = require('../models/Company');
const Job = require('../models/Jobs'); // Assuming you have a Job model defined in models/Job.js
const User = require('../models/User'); // Assuming you have a User model defined in models/User.js
const { checkAdminPrevileges, checkIfCompanyExists } = require('../util/helpers');
// Get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({message: "Jobs retrieved successfully", jobs});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new job
exports.createJob = async (req, res) => {
    checkAdminPrevileges(req.body.userId);
    checkIfCompanyExists(req.body.companyId);

    const job = new Job(req.body);
    try {
        const newJob = await job.save();
        res.status(201).json({message: "New job created", job: newJob});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a job by ID
exports.updateJob = async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a job by ID
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};