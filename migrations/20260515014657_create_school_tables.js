/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasSuppliers = await knex.schema.hasTable("suppliers");
  if (!hasSuppliers) {
    await knex.schema.createTable("suppliers", (table) => {
      table.increments("supplier_id").primary();
      table.string("supplier_name");
      table.string("supplier_address_line_1");
      table.string("supplier_address_line_2");
      table.string("supplier_city");
      table.string("supplier_state");
      table.string("supplier_zip");
      table.string("supplier_phone");
      table.string("supplier_email");
      table.text("supplier_notes");
      table.string("supplier_type_of_goods");
      table.timestamps(true, true);
    });
  }

  const hasCategories = await knex.schema.hasTable("categories");
  if (!hasCategories) {
    await knex.schema.createTable("categories", (table) => {
      table.increments("category_id").primary();
      table.string("category_name");
      table.text("category_description");
      table.timestamps(true, true);
    });
  }

  const hasProducts = await knex.schema.hasTable("products");
  let shouldCreateProducts = !hasProducts;

  if (hasProducts) {
    const hasProductTitle = await knex.schema.hasColumn("products", "product_title");
    const hasProductSku = await knex.schema.hasColumn("products", "product_sku");
    const hasSupplierId = await knex.schema.hasColumn("products", "supplier_id");
    if (!hasProductTitle || !hasProductSku || !hasSupplierId) {
      await knex.schema.dropTable("products");
      shouldCreateProducts = true;
    }
  }

  if (shouldCreateProducts) {
    await knex.schema.createTable("products", (table) => {
      table.increments("product_id").primary();
      table.string("product_sku");
      table.string("product_title");
      table.text("product_description");
      table.decimal("product_price");
      table.integer("product_quantity_in_stock");
      table.decimal("product_weight_in_lbs");
      table.integer("supplier_id").unsigned().notNullable();
      table
        .foreign("supplier_id")
        .references("supplier_id")
        .inTable("suppliers")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    });
  }

  const hasProductsCategories = await knex.schema.hasTable("products_categories");
  if (!hasProductsCategories) {
    await knex.schema.createTable("products_categories", (table) => {
      table.integer("product_id").unsigned().notNullable();
      table
        .foreign("product_id")
        .references("product_id")
        .inTable("products")
        .onDelete("CASCADE");
      table.integer("category_id").unsigned().notNullable();
      table
        .foreign("category_id")
        .references("category_id")
        .inTable("categories")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasProductsCategories = await knex.schema.hasTable("products_categories");
  if (hasProductsCategories) {
    await knex.schema.dropTable("products_categories");
  }

  const hasProducts = await knex.schema.hasTable("products");
  if (hasProducts) {
    await knex.schema.dropTable("products");
  }

  const hasCategories = await knex.schema.hasTable("categories");
  if (hasCategories) {
    await knex.schema.dropTable("categories");
  }

  const hasSuppliers = await knex.schema.hasTable("suppliers");
  if (hasSuppliers) {
    await knex.schema.dropTable("suppliers");
  }
};
