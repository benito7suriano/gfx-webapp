'use strict'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../server/app')
const agent = request.agent(app)

const { db, Producto } = require('../server/db')

// Producto Routes Tests

describe('Producto routes: ', () => {
  // First we clear the db before beginning each run

  before(() => {
    return db.sync({ force: true })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Zona.truncate({ cascade: true })
    ])
  })


})
