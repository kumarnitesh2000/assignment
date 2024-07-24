const logger = require("../utils/logger");
const router = require("express").Router();
const taskSchema = require("../models/task");
const HttpStatus = require("http-status-codes");
const StandardResponse = require("../utils/response");

router.get("/tasks", (req, res) => {
  logger.debug("get all tasks");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  taskSchema
    .find()
    .skip(skip)
    .limit(limit)
    .then((resp) => {
      res.status(HttpStatus.OK).json(resp);
    })
    .catch((err) => {
      logger.error(`Error :: ${err.message}`);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(new StandardResponse(err.message, HttpStatus.BAD_REQUEST));
    });
});
module.exports = router;
