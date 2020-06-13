import express from "express";

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import LocationsController from './controllers/LocationsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();
const locationsController = new LocationsController();

routes.get("/items", itemsController.index);

routes.post("/points", pointsController.create);
routes.get("/points", pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.get("/locations", locationsController.index);
routes.get("/locations/:region", locationsController.show);

export default routes;
