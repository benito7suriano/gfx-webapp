'use strict'

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const { db, Zona } = require('../server/db')

// Zona Model

// These tests describe the model for Zona

describe('The `Zona` model', () => {
  // First we clear the db and recreate the tables beginning a run
  before(() => {
    return db.sync({ force: true })
  })

  // Next, we create an(un - saved!) zona instance before every spec

  let zona
  beforeEach(() => {
    zona = Zona.build({
      nombre: 'San Salvador'
    })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Zona.truncate({ cascade: true })
    ])
  })

  describe('Required Fields', () => {
    // Zona has one required field:`nombre`

    beforeEach(() => {
      zona = Zona.build({
        nombre: 'San Salvador'
      })
    })

    // Also we empty the tables after each spec
    afterEach(() => {
      return Promise.all([
        Zona.truncate({ cascade: true })
      ])
    })

    it('includes NOMBRE as a required field', () => {
      return zona.save()
        .then((savedZona) => {
          expect(savedZona.nombre).to.equal('San Salvador')
        })
    })
  })
})
