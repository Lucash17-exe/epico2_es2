const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../logs/activity.log') }),
    ],
});

exports.logInfo = (msg) => {
  console.log(msg);
};
