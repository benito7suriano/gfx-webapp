'use strict'

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const { db, Tipo } = require('../server/db')

// Tipo Model

// These tests describe the model for Tipo

describe('The `Tipo` Model', () => {
  // First we clear the db and recreate the tables beginning a run
  before(() => {
    return db.sync({ force: true })
  })

  // Next, we create an(un - saved!) tipo instance before every spec

  let tipo
  beforeEach(() => {
    tipo = Tipo.build({
      nombre: '4x2'
    })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Tipo.truncate({ cascade: true })
    ])
  })

  describe('Required Fields', () => {
    // tipo has one required field:`nombre`

    beforeEach(() => {
      tipo = Tipo.build({
        nombre: '4x2'
      })
    })

    // Also we empty the tables after each spec
    afterEach(() => {
      return Promise.all([
        Tipo.truncate({ cascade: true })
      ])
    })

    it('includes NOMBRE as a required field', () => {
      return tipo.save()
        .then((savedTipo) => {
          expect(savedTipo.nombre).to.equal('4x2')
        })
    })
  })
})
