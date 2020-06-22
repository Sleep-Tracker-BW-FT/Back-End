
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();
        tbl.string("email").notNullable().unique().index();
        tbl.string("first_name").notNullable();
        tbl.string("last_name").notNullable();
        tbl.string("password").notNullable();
    })
    .createTable('sleep', tbl => {
        tbl.increments();
        tbl.timestamp("bedtime", { useTz: false }).notNullable();
        tbl.timestamp("waketime", { useTz: false }).notNullable();
        tbl.integer("mood").notNullable()
        tbl.integer("user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
  
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('sleep')
  .dropTableIfExists('users');
};
