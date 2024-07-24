const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    job_name: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Job', jobSchema);
