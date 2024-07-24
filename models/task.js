const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    eportred_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobseeker',
        required: true
    },
    moderator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Moderator',
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);
