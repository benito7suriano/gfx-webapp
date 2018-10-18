const Sequelize = require('sequelize')
const db = require('./database')

const Color = db.define('color', {
  nombre: {
    type: Sequelize.STRING
  }
})

module.exports = Color
