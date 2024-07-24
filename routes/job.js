const logger = require('../utils/logger');
const router=require('express').Router();
const jobSchema=require('../models/job')
const HttpStatus=require('http-status-codes');
const StandardResponse = require("../utils/response");

router.post('/jobs',(req,res)=>{
    logger.debug('creating job')
    jobSchema.create(req.body)
    .then((resp)=>{
        logger.debug('job created')
        res.status(HttpStatus.OK).json(resp)
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(new StandardResponse(err.message,HttpStatus.OK))
    })
})

router.get('/jobs',(req,res)=>{
    logger.debug('get all jobs')
    jobSchema.find()
    .then((resp)=>{
        res.status(HttpStatus.OK).json(resp)
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(new StandardResponse(err.message,HttpStatus.OK))
    })
})
module.exports = router;