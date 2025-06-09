import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import express from 'express';

const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const accessLogStream = createStream(
  (logTime) => {
    const utcDate = new Date(
      typeof logTime === 'number' ? logTime : logTime ?? Date.now()
    );
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(utcDate.getTime() + kstOffset);
    const y = kstDate.getFullYear();
    const m = String(kstDate.getMonth() + 1).padStart(2, '0');
    const d = String(kstDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}-access.log`;
  },
  {
    interval: '1d',
    path: logDirectory,
    initialRotation: true,
    maxFiles: 14, //14일 동안 하루에 하나씩 저장하도록 세팅
  }
);

const fileLogger = morgan(
  (tokens, req, res) => {
    const request = req as express.Request;
    return JSON.stringify({
      method: tokens['method'](req, res),
      status: tokens['status'](req, res),
      responseTime: tokens['response-time'](req, res),
      logTime: tokens['date'](req, res, 'iso'),
      url: tokens['url'](req, res),
      contentLength: tokens['res'](req, res, 'content-length'),
      requestBody: request.body,
      ip: request.ip,
      userAgent: tokens['user-agent'](req, res),
    });
  },
  { stream: accessLogStream }
);

const consoleLogger = morgan('combined');

const morganLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  fileLogger(req, res, () => {
    consoleLogger(req, res, next);
  });
};

export { morganLogger };

