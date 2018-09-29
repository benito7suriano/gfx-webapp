const Sequelize = require('sequelize')
const db = require('./database')

const Centro = db.define('centro', {
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  direccion: {
    type: Sequelize.TEXT,
    allownull: false
  },
  pais: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telarea: {
    type: Sequelize.INTEGER,
    allownull: false
  },
  telnum: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
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
