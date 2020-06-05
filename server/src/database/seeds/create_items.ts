import Knex from "knex";

export async function seed(knex: Knex) {
  await knex("items").insert([
    { title: "Light Bulbs", image: "light-bulbs.svg" },
    { title: "Batteries", image: "batteries.svg" },
    { title: "Cardboard", image: "cardboard.svg" },
    { title: "Electronics", image: "electronics.svg" },
    { title: "Organics", image: "organics.svg" },
    { title: "Cooking Oil", image: "oil.svg" },
  ]);
}
