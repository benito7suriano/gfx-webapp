'use strict'

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const { db, Pais } = require('../server/db')

// Pais Model

// These tests describe the model for País

describe('The `Pais` model', () => {
  // First we clear the db and recreate the tables beginning a run
  before(() => {
    return db.sync({ force: true })
  })

  // Next, we create an (un-saved!) país instance before every spec

  let pais
  beforeEach(() => {
    pais = Pais.build({
      nombre: 'El Salvador'
    })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Pais.truncate({ cascade: true })
    ])
  })

  describe('Required Fields', () => {
    // Pais has one required field:`nombre`

    beforeEach(() => {
      pais = Pais.build({
        nombre: 'Guatemala'
      })
    })

    // Also we empty the tables after each spec
    afterEach(() => {
      return Promise.all([
        Pais.truncate({ cascade: true })
      ])
    })

    xit('includes NOMBRE as a required field', () => {
      return pais.save()
      .then((savedPais) => {
        expect(savedPais.nombre).to.equal('Guatemala')
      })
    })
  })

  describe('Throws error if field are left NULL', () => {
    xit('requires `nombre`', () => {
      pais.nombre = ''

      return pais.validate()
      .then(() => {
        throw new Error('validation should fail when content is empty')
      },
        (result) => {
          expect(result).to.be.an.instanceOf(Error)
          expect(result.message).to.contain('Validation Error')
        })
    })
  })
})
