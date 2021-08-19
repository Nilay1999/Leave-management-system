import express from 'express';
import auth from '../middlewares/auth';
import * as LeaveController from '../controllers/leaveController';

const routes = express.Router();

routes.get('/', auth, LeaveController.getInitialLeaveData);
routes.post('/', auth, LeaveController.addLeave);
routes.get('/getLeave/:id', auth, LeaveController.getLeaveById); // get Leave Data By ID
// routes.post('/addByAdmin', auth, LeaveController.addLeaveByAdmin);
routes.post('/approveLeave/:id', auth, LeaveController.approveLeave);
routes.get('/getEmployeeList', auth, LeaveController.getEmployeeData);
routes.get('/teamLeaves', auth, LeaveController.getInitialTeamLeaves);
routes.put('/:id', auth, LeaveController.updateLeave);
routes.delete('/:id', auth, LeaveController.deleteLeave);

export default routes;
