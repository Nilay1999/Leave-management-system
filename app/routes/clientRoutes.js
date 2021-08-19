import express from 'express';
import * as ClientController from '../controllers/clientController';

const routes = express.Router();
routes.get('/', ClientController.getClients);
routes.post('/', ClientController.addClient);
routes.put('/', ClientController.editClient);
routes.delete('/', ClientController.deleteClient);

export default routes;
