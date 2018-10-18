const db = require('./database')
// require all models!

// Running each model (i.e. table) module (i.e. file) registers each model into our sequelize db
// This works well if we use the same Sequelize instance (instantiated in and exported from `/db/index.js`)

// Exporting all models from here seems like a good idea!
const Centro = require('./centro')
const Pais = require('./pais')
const Zona = require('./zona')
const User = require('./user')

// define joint tables

// associations go here
Pais.hasMany(Zona)
Zona.hasMany(Centro)

module.exports = {
  db,
  Centro,
  Pais,
  Zona,
  User
}
