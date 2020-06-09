import { Request, Response } from "express";

import Canada from "../database/canada";

class LocationsController {
  async index(request: Request, response: Response) {
    return response.json(Canada);
  }

  async show(request: Request, response: Response) {
    const { slug } = request.params;

    const data = Canada.filter((location) => location.slug == slug).map(
      (location) => location.cities
    );

    function flatten(arr) {
      return arr.reduce(function (flat, toFlatten) {
        return flat.concat(
          Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
        );
      }, []);
    }

    const cities = flatten(data);

    if (!cities) {
      return response.status(400).json({ message: "Cities not found" });
    }
    return response.json({ cities });
  }
}

export default LocationsController;
