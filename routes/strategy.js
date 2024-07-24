const logger = require("../utils/logger");
const router = require("express").Router();
const configSchema = require("../models/config");
const HttpStatus = require("http-status-codes");
const StandardResponse = require("../utils/response");
const { strategies } = require("../globalConstant");

router.patch("/strategy", (req, res) => {
  logger.info("inside change strategy function");
  const { strategy } = req.body;

  if (!strategies.includes(strategy)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(
        new StandardResponse("Invalid strategy value", HttpStatus.BAD_REQUEST)
      );
  }

  // First find the document
  configSchema
    .findOne()
    .then((config) => {
      if (!config) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new StandardResponse(
              "Config document not found",
              HttpStatus.NOT_FOUND
            )
          );
      }

      // Then update the document
      return configSchema.updateOne(
        {},
        { $set: { strategy } }
      );
    })
    .then((result) => {
      if (result.nModified === 0) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(
            new StandardResponse(
              "Config document not updated",
              HttpStatus.NOT_FOUND
            )
          );
      }

      return configSchema.findOne();
    })
    .then((updatedConfig) => {
      res.status(HttpStatus.OK).json(updatedConfig);
    })
    .catch((err) => {
      logger.error(`Error :: ${err.message}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new StandardResponse(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        );
    });
});

module.exports = router;
