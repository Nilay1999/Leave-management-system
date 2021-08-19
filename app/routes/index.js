import express from 'express';
import * as EmployeeRoutes from './employeeRoutes';
import * as ClientRoutes from './clientRoutes';
import * as MasterEntityRoutes from './masterEntityRoute';
import * as LeaveRoutes from './leaveRoutes';
import * as PaginationRoutes from './paginationRoutes';
import * as DashBoardRoutes from './dashBoardRoutes';
import * as RoleRoutes from './roleRoutes';
import * as SODRoutes from './SODRoutes';
import * as PolicyRoutes from './policyRoutes';
import * as LeaveAllocaitonRoutes from './leaveAllocationRoutes';
import * as HolidaysRoutes from './holidaysRoutes';

const routes = express.Router();
routes.use('/employees', EmployeeRoutes.default);
routes.use('/client', ClientRoutes.default);
routes.use('/masterEntity', MasterEntityRoutes.default);
routes.use('/leave', LeaveRoutes.default);
routes.use('/pagination', PaginationRoutes.default);
routes.use('/dashboard', DashBoardRoutes.default);
routes.use('/roles', RoleRoutes.default);
routes.use('/sod', SODRoutes.default);
routes.use('/policy', PolicyRoutes.default);
routes.use('/leaveAllocation', LeaveAllocaitonRoutes.default);
routes.use('/holiday', HolidaysRoutes.default);

export default routes;
