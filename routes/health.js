const express = require('express');
const router = express.Router();
const { version } = require('../package.json');
const logger = require('../utils/logger');
const env = process.env.NODE_ENV || 'development';
const StandardResponse = require("../utils/response");
const HttpStatus = require('http-status-codes');

router.get('/health', (req,res)=>{
    logger.debug(`inside health api :: stage -> ${env}`);
    var message = `report section service is running ${version} :: stage -> ${env}`;
    response = new StandardResponse(message,HttpStatus.OK)
    res.json(response);
})

module.exports = router;