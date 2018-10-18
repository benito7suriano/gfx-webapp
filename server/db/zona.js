const Sequelize = require('sequelize')
const db = require('./database')

const Zona = db.define('zona', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Zona
