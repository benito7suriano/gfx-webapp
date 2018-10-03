const Sequelize = require('sequelize')
const db = require('./database')

const Centro = db.define('centro', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  direccion: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  cluster: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pais: {
    type: Sequelize.STRING,
    allowNull: false
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
  map: {
    type: Sequelize.STRING
  },
  imgUrl: {
    type: Sequelize.STRING,
    defaultValue: '../../public/images/GrupoFerromax.jpg'
  }
})

module.exports = Centro
