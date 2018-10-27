'use strict'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../server/app')
const agent = request.agent(app)

const { db, Zona } = require('../server/db')

// Zona Routes Tests

describe('Zona routes: ', () => {
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

  // GET all zonas
  describe('GET /zonas', () => {
    /* We'll run a GET req to /zonas

    1. It should return JSON (i.e.: use res.json)
    2. Because there isn't anything in the DB, it should be an empty array
    */

    it('responds with an array via JSON', () => {
      return agent
        .get('/api/zonas')
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
    * Save an new zona in the db using model and then retrieve it using the GET /zonas route
    *
     */

    it('returns a zona if there is one in the db', () => {
      let zona = Zona.build({
        nombre: 'San Salvador'
      })

      return zona.save().then(() => {

        return agent
          .get('/api/zonas')
          .expect(200)
          .expect((res) => {
            expect(res.body)
              .to.be.an.instanceOf(Array)
            expect(res.body[0].nombre)
              .to.equal('San Salvador')
          })
      })
    })

    /*
    * Save a second article in the db using our model, then retrieve it using the GET /api/zonas route
    */
    it('returns another zona if there is one in the db', () => {
      let zona1 = Zona.build({
        nombre: 'San Salvador'
      })
      let zona2 = Zona.build({
        nombre: 'San Vicente'
      })

      return zona1.save()
        .then(() => {
          return zona2.save()
        })
        .then(() => {
          return agent
            .get('/api/zonas')
            .expect(200)
            .expect((res) => {
              expect(res.body)
                .to.be.an.instanceOf(Array)
              expect(res.body[0].nombre)
                .to.equal('San Salvador')
              expect(res.body[1].nombre)
                .to.equal('San Vicente')
            })
        })
    })
  })
})

