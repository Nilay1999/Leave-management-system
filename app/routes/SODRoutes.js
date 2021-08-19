import express from 'express';
import auth from '../middlewares/auth';
import * as SODController from '../controllers/SODController';

const routes = express.Router();

// routes.get('/getSodById/:id', auth, SODController.viewSODbyID); // get SOD Data By ID
routes.get('/getTeamTasks', auth, SODController.getTeamSODs);
routes.get('/getMyTask', auth, SODController.getMySOD);
routes.get('/getMyTask/:id', auth, SODController.getSODInfo);
routes.post('/addTask', auth, SODController.addLog);
routes.put('/editTask/:id', auth, SODController.editSOD);
// routes.put('/addEOD/:id', auth, SODController.addEOD);
routes.put('/approveTask/:id', auth, SODController.approveLog);

export default routes;
