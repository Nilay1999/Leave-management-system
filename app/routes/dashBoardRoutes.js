import express from 'express';
import auth from '../middlewares/auth';
import * as dashBoardController from '../controllers/dashBoardController';

const routes = express.Router();

routes.get('/', auth, dashBoardController.initialDashBoardData);

export default routes;
