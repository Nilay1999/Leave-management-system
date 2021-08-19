import express from 'express';
import auth from '../middlewares/auth';
import * as RoleController from '../controllers/roleController';

const routes = express.Router();

routes.get('/', RoleController.getRoles);
routes.post('/', RoleController.addRole);

export default routes;
