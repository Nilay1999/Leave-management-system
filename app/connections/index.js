import mongoose from 'mongoose';
import { initMasterEntities, initRoles } from '../setup';
import * as config from '../env';
import logger from '../middlewares/logger';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    logger.error('MongoDB database connection failed');
    console.log(err);
  });

mongoose.connection.once('open', () => {
  // initMasterEntities();
  // initRoles();
  logger.info('🎸 MongoDB database connection successfully established... 🚀');
});

export default mongoose;
