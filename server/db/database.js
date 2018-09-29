const Sequelize = require('sequelize')
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/gfx', {
    logging: false
  })

module.exports = db
