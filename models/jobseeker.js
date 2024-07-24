const mongoose = require('mongoose');

/**
 * Validate email
 * @param {*} email 
 */
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

/**
 * Validate name
 * @param {*} name 
 */
var validateName = function(name) {
    return isNaN(parseInt(name, 10));
};

const jobseekerSchema = new mongoose.Schema({
    name: {
        type: String,
        validate: [validateName, 'Please fill a valid name'],
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    }
});

module.exports = mongoose.model('Jobseeker', jobseekerSchema);
