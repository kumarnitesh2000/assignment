const logger = require('../utils/logger');
const router=require('express').Router();
const jobseekerSchema=require('../models/jobseeker')
const HttpStatus=require('http-status-codes');
const StandardResponse = require("../utils/response");

router.post('/seekers',(req,res)=>{
    logger.debug('creating seeker')
    jobseekerSchema.create(req.body)
    .then((resp)=>{
        logger.debug('seeker created')
        res.status(HttpStatus.OK).json(resp)
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(new StandardResponse(err.message,HttpStatus.OK))
    })
})

router.get('/seekers',(req,res)=>{
    logger.debug('get all seekers')
    jobseekerSchema.find()
    .then((resp)=>{
        res.status(HttpStatus.OK).json(resp)
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(new StandardResponse(err.message,HttpStatus.OK))
    })
})
module.exports = router;