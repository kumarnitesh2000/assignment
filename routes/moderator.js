const logger = require("../utils/logger");
const router = require("express").Router();
const moderatorSchema = require("../models/moderator");
const HttpStatus = require("http-status-codes");
const StandardResponse = require("../utils/response");
const { validateKeysForModeratorUpdate } = require("../middleware");

router.post("/moderators", (req, res) => {
  logger.debug("creating moderator");
  moderatorSchema
    .create(req.body)
    .then((resp) => {
      logger.debug("moderator created");
      res.status(HttpStatus.OK).json(resp);
    })
    .catch((err) => {
      logger.error(`Error :: ${err.message}`);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(new StandardResponse(err.message, HttpStatus.OK));
    });
});

router.get("/moderators", (req, res) => {
  logger.debug("get all moderators");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  moderatorSchema
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

router.put(
  "/moderators/:moderatorId",
  validateKeysForModeratorUpdate,
  (req, res) => {
    const { moderatorId } = req.params;
    const updateData = req.body;

    moderatorSchema
      .updateOne({ _id: moderatorId }, { $set: updateData })
      .then((resp) => {
        res.status(HttpStatus.OK).json(resp);
      })
      .catch((err) => {
        logger.error(`Error :: ${err.message}`);
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(new StandardResponse(err.message, HttpStatus.BAD_REQUEST));
      });
  }
);

module.exports = router;
