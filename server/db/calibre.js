const Sequelize = require('sequelize')
const db = require('./database')

const Calibre = db.define('calibre', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  espesorDiametroSi: {
    type: Sequelize.STRING
  },
  espesorDiametroBu: {
    type: Sequelize.STRING
  }
})
