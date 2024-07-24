const app = require("./app");
const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];
const PORT = config.port;
const logger = require("./utils/logger");
const { connect } = require("./utils/dbutils");
const configSchema = require("./models/config");
const { strategies } = require("./globalConstant");

app.listen(PORT, () => {
  logger.info(`app is running :: listening at ${PORT}`);
});

connect()
  .then(() => {
    logger.info("connected to mongo db");
    // initialize configuration document
    configSchema.find().then((config) => {
      if (config.length > 0) return;
      configSchema
        .create({ strategy: strategies[0], weight: -1 })
        .then(() => {
          logger.info("configuration document created");
        })
        .catch((err) => {
          logger.error(`Error :: ${err.message}`);
          res
            .status(HttpStatus.BAD_REQUEST)
            .json(new StandardResponse(err.message, HttpStatus.OK));
        });
    });
  })
  .catch((err) => {
    logger.error(`not connected to mongo db due to ${err}`);
  });
