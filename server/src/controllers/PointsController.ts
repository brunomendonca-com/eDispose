import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const points = await knex("points").select("*");

        if (!points || points.length == 0) {
          return response.status(400).json({ message: "Points not found" });
        }
    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(400).json({ message: "Point not found" });
    }

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      phone,
      region,
      location,
      latitude,
      longitude,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image:
        "https://images.unsplash.com/photo-1559539620-ec0c0f46e19e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=60",
      name,
      email,
      phone,
      region,
      location,
      latitude,
      longitude,
    };

    const insertedIds = await trx("points").insert(point);

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    try {
      await trx("point_items").insert(pointItems);
      await trx.commit();
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        message:
          "Insertion on table point_items failed. Please, verify the inputted values.",
      });
    }

    return response.json({ id: point_id, ...point });
  }
}

export default PointsController;
