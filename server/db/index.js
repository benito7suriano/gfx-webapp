const db = require('./database')
// require all models!

// Running each model (i.e. table) module (i.e. file) registers each model into our sequelize db
// This works well if we use the same Sequelize instance (instantiated in and exported from `/db/index.js`)

// Exporting all models from here seems like a good idea!
const Centro = require('./centro')
const Pais = require('./pais')

// define joint tables

// associations go here

module.exports = {
  db,
  Centro,
  Pais
}
