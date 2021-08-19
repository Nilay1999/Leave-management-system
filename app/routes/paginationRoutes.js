import express from 'express';
import auth from '../middlewares/auth';
import * as PaginationController from '../controllers/paginationController';

const routes = express.Router();

routes.get('/leave', auth, PaginationController.allLeave);

export default routes;
