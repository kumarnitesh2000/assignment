const logger = require('../utils/logger');
const router=require('express').Router();
const moderatorSchema=require('../models/moderator')
const HttpStatus=require('http-status-codes');
const StandardResponse = require("../utils/response");

router.post('/moderators',(req,res)=>{
    logger.debug('creating moderator')
    moderatorSchema.create(req.body)
    .then((resp)=>{
        logger.debug('moderator created')
        res.status(HttpStatus.OK).json(resp)
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(new StandardResponse(err.message,HttpStatus.OK))
    })
})

router.get('/moderators',(req,res)=>{
    logger.debug('get all moderators')
    moderatorSchema.find()
    .then((resp)=>{
        res.status(HttpStatus.OK).json(resp)
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(new StandardResponse(err.message,HttpStatus.OK))
    })
})
module.exports = router;