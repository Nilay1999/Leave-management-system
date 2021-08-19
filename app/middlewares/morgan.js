import morgan from 'morgan';
import * as config from '../env';
import Logger from './logger';

const stream = {
  write: (message) => Logger.http(message),
};

const skip = () => {
  const env = config.environment || 'local';
  return env !== 'local';
};

const morganMiddleware = morgan(
  '[ :method :url ] [status => :status ] [ response time => :response-time ms ]',

  { stream, skip }
);

export default morganMiddleware;
