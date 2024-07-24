const app = require("./app");
const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];
const PORT = config.port;
const logger = require("./utils/logger");

app.listen(PORT, () => {
  logger.info(`app is running :: listening at ${PORT}`);
});
