const db = require('./database')
// require all models!

// Running each model (i.e. table) module (i.e. file) registers each model into our sequelize db
// This works well if we use the same Sequelize instance (instantiated in and exported from `/db/index.js`)

// Exporting all models from here seems like a good idea!
const Centro = require('./centro')
const Pais = require('./pais')
const Zona = require('./zona')
const User = require('./user')
const Producto = require('./producto')
const Tipo = require('./tipo')
const Calibre = require('./calibre')
const Color = require('./color')

// define joint tables

// associations go here
Pais.hasMany(Zona)
Zona.hasMany(Centro)
Producto.hasMany(Tipo)
Tipo.hasMany(Calibre)
Producto.hasMany(Color)

User.belongsToMany(Pais)
Pais.belongsToMany(User)

module.exports = {
  db,
  Centro,
  Pais,
  Zona,
  User,
  Producto,
  Tipo,
  Calibre,
  Color
}
