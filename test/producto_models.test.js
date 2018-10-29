'use strict'

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const { db, Producto } = require('../server/db')

// Producto Model

// These tests describe the model for Producto

describe('The `Producto` model', () => {
  // First we clear the db and recreate the tables beginning a run
  before(() => {
    return db.sync({ force: true })
  })

  // Next, we create an (un-saved!) país instance before every spec

  let producto
  beforeEach(() => {
    producto = Producto.build({
      nombre: 'GHT',
      descripcion: 'lorem ipsum dolorem'
    })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Producto.truncate({ cascade: true })
    ])
  })

  describe('Required Fields', () => {
    // producto has one required field:`nombre`

    beforeEach(() => {
      producto = Producto.build({
        nombre: 'GHT',
        descripcion: 'lorem ipsum dolorem'
      })
    })

    // Also we empty the tables after each spec
    afterEach(() => {
      return Promise.all([
        Producto.truncate({ cascade: true })
      ])
    })

    it('includes NOMBRE as a required field', () => {
      return producto.save()
        .then((savedProducto) => {
          expect(savedProducto.nombre).to.equal('GHT')
        })
    })
  })

  describe('Throws error if field are left NULL', () => {
    it('requires `nombre`', () => {
      producto.nombre = ''

      return producto.validate()
        .then(() => {
          throw new Error('validation should fail when content is empty')
        },
          (result) => {
            expect(result).to.be.an.instanceOf(Error)
          })
    })
  })
})
