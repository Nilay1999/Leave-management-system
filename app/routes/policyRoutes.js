import express from 'express';
import auth from '../middlewares/auth';
import * as policyController from '../controllers/policyController';

const routes = express.Router();

routes.get('/getAll', auth, policyController.getPolicies);
routes.get('/view/:id', auth, policyController.viewPolicy);
routes.post('/add', auth, policyController.addPolicy);
routes.put('/edit/:id', auth, policyController.editPolicy);
routes.delete('/:id', auth, policyController.deletePolicy);

export default routes;
