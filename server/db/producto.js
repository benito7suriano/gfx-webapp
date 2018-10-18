const Sequelize = require('sequelize')
const db = require('./database')

const Producto = db.define('producto', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = Producto
