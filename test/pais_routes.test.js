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
    * Save a second article in the db using our modle, then retrieve it using the GET /api/paises route
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
})
