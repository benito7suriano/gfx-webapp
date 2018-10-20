'use strict'

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const { db, User } = require('../server/db')

// User model

// These tests describe the model for users

describe('The `User` model',() => {
  // First we clear the db and recreate the tables beginning a run
  before(() => {
    return db.sync({force: true})
  })

  // Next, we create an (un-saved!) user instance before every spec

  let user
  beforeEach(() => {
    user = User.build({
      nombre: 'Beno',
      apellido: 'Suriano',
      telarea: 503,
      telnum: 23980530,
      email: 'benosuriano@gmail.com',
      empresa: 'Grupo Ferromax',
      subscripcion: true
    })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      User.truncate({ cascade: true })
    ])
  })

  describe('Required fields', () => {
    // User has SIX req'd fields: `nombre`, `apellido`, `telarea`, `telnum`, `email`, `subscripcion`

    beforeEach(() => {
      user = User.build({
        nombre: 'Camila',
        apellido: 'Carpio',
        telarea: 503,
        telnum: 78561248,
        email: 'camilacarpio@gmail.com',
        empresa: 'Grupo Carpio',
        subscripcion: true
      })
    })

    // Also we empty the tables after each spec
    afterEach(() => {
      return Promise.all([
        User.truncate({ cascade: true })
      ])
    })

    it('includes ALL six req\'d fields', () => {

      return user.save()
      .then((savedUser) => {
        expect(savedUser.nombre).to.equal('Camila')
        expect(savedUser.apellido).to.equal('Carpio')
        expect(savedUser.telarea).to.equal(503)
        expect(savedUser.telnum).to.equal(78561248)
        expect(savedUser.email).to.equal('camilacarpio@gmail.com')
        expect(savedUser.empresa).to.equal('Grupo Carpio')
        expect(savedUser.subscripcion).to.equal(true)
      })
    })
  })

  describe('Throws error if fields are left NULL', () => {
    it('requires `nombre`', () => {
      user.nombre = null

      return user.validate()
        .then(() => {
          throw new Error('validation should fail when content is empty')
        },
          (result) => {
            expect(result).to.be.an.instanceOf(Error)
          })
    })

    it('requires `apellido`', () => {
      user.apellido = null

      return user.validate()
        .then(() => {
          throw new Error('validation should fail when content is empty')
        },
          (result) => {
            expect(result).to.be.an.instanceOf(Error)
          })
    })

    it('requires `telarea`', () => {
      user.telarea = null

      return user.validate()
        .then(() => {
          throw new Error('validation should fail when content is empty')
        },
          (result) => {
            expect(result).to.be.an.instanceOf(Error)
          })
    })

    it('requires `telnum`', () => {
      user.telnum = null

      return user.validate()
        .then(() => {
          throw new Error('validation should fail when content is empty')
        },
          (result) => {
            expect(result).to.be.an.instanceOf(Error)
          })
    })

    it('requires `email`', () => {
      user.email = null

      return user.validate()
        .then(() => {
          throw new Error('validation should fail when content is empty')
        },
          (result) => {
            expect(result).to.be.an.instanceOf(Error)
          })
    })

    it('requires `subscripcion`', () => {
      user.subscripcion = null

      return user.validate()
        .then(() => {
          throw new Error('validation should fail when content is empty')
        },
          (result) => {
            expect(result).to.be.an.instanceOf(Error)
          })
    })



  })
})
