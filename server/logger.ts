import pino from 'pino';

let transportConfig;

if (process.env.NODE_ENV !== 'production') {
  transportConfig = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}
// If not in development, transportConfig will remain undefined, which is the desired default.

const logger = pino({
  transport: transportConfig,
});

export default logger;
