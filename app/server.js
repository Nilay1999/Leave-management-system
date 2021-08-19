import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from './middlewares/morgan';
import * as config from './env';
import * as Routes from './routes';
import errorHandler from './middlewares/errorHandler';
import successHandler from './middlewares/successHandler';
import logger from './middlewares/logger';
import { allocateLeave } from './utils';
import './connections';

const app = express();

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

app.use(morgan);
app.use(cors());
app.use('/uploads', express.static('app/uploads'));

allocateLeave();
app.use(helmet());
app.options('*', cors());

// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// parse various different custom JSON types as JSON
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Running....' });
});
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/api', Routes.default);
app.use(errorHandler);
app.use(successHandler);

app.listen(config.port).on('listening', () => {
  logger.info(
    `🎸 Operations Management System Backend are live on ${config.port} 🚀`
  );
});

export default app;
