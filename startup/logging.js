/** @format */
require('express-async-handler');
const winston = require('winston');

module.exports = function () {
  process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

    winston.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        ),
      }),
    );
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
};
