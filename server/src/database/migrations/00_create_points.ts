import Knex from "knex";

export async function up(knex: Knex) {
  //create table
  return knex.schema.createTable("points", (table) => {
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("phone").notNullable();
    table.string("whatsapp").notNullable();
    table.decimal("latitude").notNullable();
    table.decimal("longitude").notNullable();
    table.string("address").notNullable();
    table.string("city").notNullable();
    table.string("province", 2).notNullable();
  });
}

export async function down(knex: Knex) {
  //delete table
  return knex.schema.dropTable('points');
}
