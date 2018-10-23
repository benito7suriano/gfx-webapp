'use strict'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../server/app')
const agent = request.agent(app)

const { db, Pais } = require('../server/db')

// Pais Route Tests

describe('País routes: ', () => {
  // First we clear the db before beginning each run

  before(() => {
    return db.sync({ force: true })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Pais.truncate({ cascade: true })
    ])
  })

  // GET all países
  describe('GET /paises', () => {
    /* We'll run a GET req to /paises

    1. It should return JSON (i.e.: use res.json)
    2. Because there isn't anything in the DB, it should be an empty array
    */

    it('responds with an array via JSON', () => {
      return agent
        .get('/api/paises')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .expect((res) => {
          // res.body is the JSON return object
          expect(res.body).to.be.an.instanceOf(Array)
          expect(res.body).to.have.length(0)
        })
    })
    /*
    *
    * Save an new pais in the db using model and then retrieve it using the GET /paises route
    *
     */

    it('returns a pais if there is one in the db', () => {
      let pais = Pais.build({
        nombre: 'El Salvador'
      })

      return pais.save().then(() => {

        return agent
          .get('/api/paises')
          .expect(200)
          .expect((res) => {
            expect(res.body)
              .to.be.an.instanceOf(Array)
            expect(res.body[0].nombre)
              .to.equal('El Salvador')
          })
      })
    })

    /*
    * Save a second article in the db using our model, then retrieve it using the GET /api/paises route
    */
    it('returns another pais if there is one in the db', () => {
      let pais1 = Pais.build({
        nombre: 'El Salvador'
      })
      let pais2 = Pais.build({
        nombre: 'Honduras'
      })

      return pais1.save()
        .then(() => {
          return pais2.save()
        })
        .then(() => {
          return agent
            .get('/api/paises')
            .expect(200)
            .expect((res) => {
              expect(res.body)
                .to.be.an.instanceOf(Array)
              expect(res.body[0].nombre)
                .to.equal('El Salvador')
              expect(res.body[1].nombre)
                .to.equal('Honduras')
            })
        })
    })
  })

  // GET países by Id
  describe('GET /api/paises/:paisId', () => {
    let paisExample

    beforeEach(() => {
      let creatingPaises = [{
        nombre: 'El Salvador'
      },
      {
        nombre: 'Guatemala'
      },
      {
        nombre: 'Honduras'
      }
      ].map(data => Pais.create(data))

      return Promise.all(creatingPaises)
        .then(createdPaises => {
          paisExample = createdPaises[0]
        })
    })

    /**
     * This is a proper GET /api/paises/paisId req where we search by the ID of the pais created above
     */
    it('returns the JSON of the pais based on the id', () => {
      return agent
        .get('/api/paises/' + paisExample.id)
        .expect(200)
        .expect((res) => {
          if (typeof res.body === 'string') {
            res.body = JSON.parse(res.body)
          }
          expect(res.body[0].nombre).to.equal('El Salvador')
        })
    })
    it('returns a 404 error if the ID is not valid', () => {
      return agent
        .get('/api/paises/347890')
        .expect(404)
    })
  })
})
