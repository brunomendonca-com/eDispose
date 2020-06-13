import { Request, Response } from "express";

import Canada from "../database/canada";

class LocationsController {
  async index(request: Request, response: Response) {
    return response.json(Canada);
  }

  async show(request: Request, response: Response) {
    const { region } = request.params;

    const filteredResult = Canada.find(({ initials }) => initials === (region.toUpperCase()));

    const locations = filteredResult?.cities;

    if (!locations) {
      return response.status(400).json({ message: "Locations not found" });
    }

    return response.json({ locations });
  }
}

export default LocationsController;
