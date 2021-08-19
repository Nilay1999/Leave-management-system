import express from 'express';
import * as leaveAllocationController from '../controllers/leaveAllocationController';
import auth from '../middlewares/auth';
const routes = express.Router();

routes.get('/:id/:year', leaveAllocationController.getLeaveData);
routes.get('/filter/byYear/:year', leaveAllocationController.getLeaveByYear);
routes.put('/', leaveAllocationController.allocateLeave);
routes.put('/leaveAction/addLeave/:id', leaveAllocationController.addLeave);
routes.put(
  '/leaveAction/carryForward/:id',
  auth,
  leaveAllocationController.carryForwardLeave
);
routes.put(
  '/leaveAction/compensate/:id',
  auth,
  leaveAllocationController.compensateLeave
);

export default routes;
