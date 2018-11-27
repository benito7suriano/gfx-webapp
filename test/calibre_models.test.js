'use strict'

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const { db, Calibre } = require('../server/db')

// Calibre Model

// These tests describe the model for Calibre

describe('The `Calibre` model', () => {
  // First we clear the db and recreate the tables beginning a run
  before(() => {
    return db.sync({ force: true })
  })

  // Next, we create an (un-saved!) país instance before every spec

  let calibre

  beforeEach(() => {
    calibre = Calibre.build({
      nombre: 'GHT16',
      espesorDiametroSi: '1.00mm',
      espesorDiametroBu: '0.039in'
    })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Calibre.truncate({ cascade: true })
    ])
  })

  describe('Required Fields', () => {
    // calibre has one required field:`nombre`

    beforeEach(() => {
      calibre = Calibre.build({
        nombre: 'GHT16'
      })
    })

    // Also we empty the tables after each spec
    afterEach(() => {
      return Promise.all([
        Calibre.truncate({ cascade: true })
      ])
    })

    it('includes NOMBRE as a required field', () => {
      return calibre.save()
        .then((savedCalibre) => {
          expect(savedCalibre.nombre).to.equal('GHT16')
        })
    })
  })
})
