import express from 'express';
import * as holidayController from '../controllers/holidaysController';
import upload from '../middlewares/multer';
import auth from '../middlewares/auth';

const routes = express.Router();

routes.get('/:year', auth, holidayController.getHolidays);
routes.post('/', auth, holidayController.addHolidays);
routes.post(
  '/csv/upload',
  auth,
  upload.single('upload'),
  holidayController.upload
);
routes.put('/:id', auth, holidayController.editHoliday);
routes.delete('/:id', auth, holidayController.deleteHoliday);

export default routes;
