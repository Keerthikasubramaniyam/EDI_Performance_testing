const log4js = require("log4js");
log4js.configure({
  appenders: {
    out: { type: "console" },
    app: {
      type: "file",
      filename: "logs/app.log",
      maxLogSize: 20485760,
      backups: 30,
    },
  },
  categories: {
    default: { appenders: ["out", "app"], level: "debug" },
  },
});
const logger = log4js.getLogger();
logger.level = "debug";
module.exports = logger;
