const mongoose = require('mongoose');
const {strategies} = require("../globalConstant");
const configSchema = new mongoose.Schema({
    strategy: {
        type: String,
        required: true,
        enum: strategies
    }
});

module.exports = mongoose.model('config', configSchema);
