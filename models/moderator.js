const mongoose = require('mongoose');
const {cities,shifts,languages} = require("../globalConstant");

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
var validateName = function(name){
    return isNaN(parseInt(name, 10));
};

const moderatorSchema = new mongoose.Schema({
    name: {
        type: String,
        validate: [validateName, 'Please fill a valid name'],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    departments: {
        type: [String],
        required: true
    },
    preferred_language: {
        type: String,
        required: true,
        enum: languages
    },
    shift_timing: {
        type: String,
        required: true,
        enum: shifts
    },
    performance_score: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
        default: 0
    },
    preferred_city: {
        type: String,
        required: true,
        enum: cities
    },
    absent: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

module.exports = mongoose.model('Moderator', moderatorSchema);