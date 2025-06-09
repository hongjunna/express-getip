import winston from 'winston';
const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  })
);
const transports = [new winston.transports.Console()];

const logger = winston.createLogger({
  level: 'debug',
  format,
  transports,
});

export default logger;

