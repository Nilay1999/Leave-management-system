import express from 'express';
import auth from '../middlewares/auth';
import * as EmployeeContoller from '../controllers/employeeContoller';

const routes = express.Router();

/* Employee Login */
routes.post('/login', EmployeeContoller.login);

/* Employee Add,Update,Delete */
routes.get('/getEmployees', auth, EmployeeContoller.getEmployeeList);
routes.get('/getEmployee/:id', auth, EmployeeContoller.getEmployeeDetail);

/* Add employee */
routes.post('/add', auth, EmployeeContoller.registerEmployee);

/* Edit own profile details */
routes.put('/edit/:id', auth, EmployeeContoller.editOwnProfile);
// routes.put('/updateByAdmin/:id', auth, EmployeeContoller.updateByAdmin);

/* Edit employee profile by Admin */
routes.put(
  '/editEmployeeData/:id',
  auth,
  EmployeeContoller.editEmployeeProfile
);

/* Change password */
routes.put('/changePassword/:id', auth, EmployeeContoller.changePassword);

/* Delete employee Data */
routes.delete('/delete/:id', auth, EmployeeContoller.deleteEmployee);

export default routes;
