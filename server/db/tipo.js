const Sequelize = require('sequelize')
const db = require('./database')

const Tipo = db.define('tipo', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Tipo
