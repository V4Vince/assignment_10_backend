const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: { type: Array, required: true },
    salary: { type: String, required: true },
    lastUpdated: { type: Date }, // Field to store the path of the uploaded image
    applyLink: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    // companyName: { type: String, required: true }
});

module.exports = mongoose.model('Job', jobSchema);