const Sequelize = require('sequelize')
const db = require('./database')

const Pais = db.define('pais', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  region: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Pais
