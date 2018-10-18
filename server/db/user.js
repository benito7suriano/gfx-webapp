const Sequelize = require('sequelize')
const db = require('./database')

const User = db.define('user', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  apellido: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  telarea: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  telnum: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  empresa: {
    type: Sequelize.STRING
  },
  subscripcion: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = User
