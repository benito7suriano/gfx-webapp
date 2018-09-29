'use strict'

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const { db, Centro } = require('../server/db')

// CDS Model

/* These tests describe the model for CDS */

describe('The `Centro` model', () => {
  // First we clear the db and recreate the tables beginning a run
  before(() => {
    return db.sync({force: true})
  })

  // Next, we create an (un-saved!) centro instance before every spec

  let centro
  beforeEach(() => {
    centro = Centro.build({
      nombre: 'Centro de Servicio',
      direccion: '1234 Blvd., Street Name, City',
      pais: 'El Salvador',
      telarea: 503,
      telnum: 22128813,
      email: 'xxx@grupoferromax.com'
    })
  })

  // Also we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Centro.truncate({ cascade: true })
    ])
  })

  describe('attributes definition', () => {
    // Centro has six required fields: `nombre`, `dirección`, `país`, `telarea`, `telnum`, `email`

    it('includes six required fields (nombre, dirección, país, telarea, telnum, email', () => {
      return centro.save()
      .then((savedCentro) => {
        expect(savedCentro.nombre).to.equal('Centro de Servicio')
        expect(savedCentro.direccion).to.equal('1234 Blvd., Street Name, City')
        expect(savedCentro.pais).to.equal('El Salvador')
        expect(savedCentro.telarea).to.equal(503)
        expect(savedCentro.telnum).to.equal(22128813)
        expect(savedCentro.email).to.equal('xxx@grupoferromax.com')
      })
    })

    it('requires `nombre`', () => {
      centro.nombre = null

      return centro.validate()
      .then(() => {
        throw new Error('validation should fail when content is null')
      },
      (result) => {
        expect(result).to.be.an.instanceOf(Error)
      })
    })
    it('requires `direccion`', () => {
      centro.direccion = null

      return centro.validate()
      .then(() => {
        throw new Error('validation should fail when content is null')
      },
      (result) => {
        expect(result).to.be.an.instanceOf(Error)
      })
    })
    it('requires `pais`', () => {
      centro.pais = null

      return centro.validate()
      .then(() => {
        throw new Error('validation should fail when content is null')
      },
      (result) => {
        expect(result).to.be.an.instanceOf(Error)
      })
    })
    it('requires `telarea`', () => {
      centro.telarea = null

      return centro.validate()
      .then(() => {
        throw new Error('validation should fail when content is null')
      },
      (result) => {
        expect(result).to.be.an.instanceOf(Error)
      })
    })
    it('requires `telnum`', () => {
      centro.telnum = null

      return centro.validate()
      .then(() => {
        throw new Error('validation should fail when content is null')
      },
      (result) => {
        expect(result).to.be.an.instanceOf(Error)
      })
    })
    it('requires `email`', () => {
      centro.email = null

      return centro.validate()
      .then(() => {
        throw new Error('validation should fail when content is null')
      },
      (result) => {
        expect(result).to.be.an.instanceOf(Error)
      })
    })
  })
})
