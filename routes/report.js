const logger = require("../utils/logger");
const router = require("express").Router();
const moderatorSchema = require("../models/moderator");
const HttpStatus = require("http-status-codes");
const taskSchema = require("../models/task");
const StandardResponse = require("../utils/response");
const { currentShift } = require("../utils/helper");
const configSchema = require("../models/config");
const {
  PerformanceBased,
  RoundRobin,
  WeightedRoundRobin,
} = require("../utils/assignment");
const { createRedisClient } = require("../utils/dbutils");

router.post("/report", (req, res) => {
  logger.debug("report the job");
  let current_shift = currentShift();
  const cacheKey = `moderators:${current_shift}`;
  const { job_id, seeker_id, reason } = req.body;
  let configDoc = {};
  let redisClient;
  configSchema
    .find()
    .then((config) => {
      configDoc = config[0];
      return createRedisClient();
    })
    .then((_redisClient) => {
      logger.info(`searching for cache key ${cacheKey}`);
      redisClient = _redisClient;
      return redisClient.get(cacheKey);
    })
    .then((cachedModerators) => {
      if (cachedModerators) {
        logger.info("Cache hit for moderators");
        return Promise.resolve(JSON.parse(cachedModerators));
      }
      logger.info("Cache miss for moderators");
      return moderatorSchema.find({
        absent: false,
        active: true,
        shift_timing: current_shift,
      });
    })
    .then((moderators) => {
      // TTL is of 1 hour
      redisClient.set(cacheKey, JSON.stringify(moderators), 'EX', 3600);
      let assignmentStrategy;
      const { strategy } = configDoc;

      if (strategy === "round_robin") {
        assignmentStrategy = new RoundRobin(moderators,redisClient);
      } else if (strategy === "weighted_round_robin") {
        assignmentStrategy = new WeightedRoundRobin(moderators,redisClient);
      } else {
        assignmentStrategy = new PerformanceBased(moderators);
      }
      return assignmentStrategy.getSelectedModerator();
    })
    .then((moderator)=>{
      return taskSchema.create({
        job_id,
        reported_by: seeker_id,
        moderator: moderator["_id"],
        reason,
      });
    })
    .then((resp) => {
      logger.debug("task created");
      res.status(HttpStatus.OK).json(resp);
    })
    .catch((err) => {
      console.log(err);
      logger.error(`Error :: ${err.message}`);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(new StandardResponse(err.message, HttpStatus.BAD_REQUEST));
    });
});

module.exports = router;
