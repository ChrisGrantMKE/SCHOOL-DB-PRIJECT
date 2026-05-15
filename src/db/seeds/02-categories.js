const categories = require("../fixtures/categories");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE categories RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("categories").insert(categories);
    });
};
