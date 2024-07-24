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

router.post("/report", (req, res) => {
  logger.debug("report the job");
  const {job_id,seeker_id,reason} = req.body;
  let configDoc = {};
  configSchema
    .find()
    .then((config) => {
      configDoc = config[0];
      return moderatorSchema.find({
        absent: false,
        active: true,
        shift_timing: currentShift(),
      });
    })
    .then((moderators) => {
      let assignmentStrategy;
      let {strategy} = configDoc;
      if (strategy === "round_robin") {
        assignmentStrategy = new RoundRobin(moderators);
      } else if (strategy === "weighted_round_robin") {
        assignmentStrategy = new WeightedRoundRobin(moderators);
      } else {
        assignmentStrategy = new PerformanceBased(moderators);
      }
      let moderator = assignmentStrategy.getSelectedModerator();
      return taskSchema.create({job_id,reported_by: seeker_id,moderator: moderator["_id"],reason})
    })
    .then((resp)=>{
        logger.debug('task created')
        res.status(HttpStatus.OK).json(resp)
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(new StandardResponse(err.message,HttpStatus.OK))
    });
});

module.exports = router;
