const Sequelize = require('sequelize')
const db = require('./database')

const Pais = db.define('pais', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Pais
