'use strict'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../server/app')
const agent = request.agent(app)

const { db, Tipo } = require('../server/db')

// Tipo Routes Tests

describe('Tipo routes: ', () => {
  // First we clear the db before beginning each run

  before(() => {
    return db.sync({ force: true })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Tipo.truncate({ cascade: true })
    ])
  })

  // GET all tipos
  describe('GET /tipos', () => {
    /* We'll run a GET req to /tipos

    1. It should return JSON (i.e.: use res.json)
    2. Because there isn't anything in the DB, it should be an empty array
    */

    it('responds with an array via JSON', () => {
      return agent
        .get('/api/tipos')
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
    * Save an new tipo in the db using model and then retrieve it using the GET /tipos route
    *
     */

    it('returns a tipo if there is one in the db', () => {
      let tipo = Tipo.build({
        nombre: '4"x2"'
      })

      return tipo.save().then(() => {

        return agent
          .get('/api/tipos')
          .expect(200)
          .expect((res) => {
            expect(res.body)
              .to.be.an.instanceOf(Array)
            expect(res.body[0].nombre)
              .to.equal('4"x2"')
          })
      })
    })

    /*
    * Save a second tipo in the db using our model, then retrieve it using the GET /api/tipos route
    */
    it('returns another tipo if there is one in the db', () => {
      let tipo1 = Tipo.build({
        nombre: '4"x2"'
      })
      let tipo2 = Tipo.build({
        nombre: '6"x2"'
      })

      return tipo1.save()
        .then(() => {
          return tipo2.save()
        })
        .then(() => {
          return agent
            .get('/api/tipos')
            .expect(200)
            .expect((res) => {
              expect(res.body)
                .to.be.an.instanceOf(Array)
              expect(res.body[0].nombre)
                .to.equal('4"x2"')
              expect(res.body[1].nombre)
                .to.equal('6"x2"')
            })
        })
    })
  })

  // GET tipos by Id
  describe('GET /api/tipos/:tipoId', () => {
    let tipoExample

    beforeEach(() => {
      let creatingTipos = [{
        nombre: '4"x2"'
      },
      {
        nombre: '6"x2"'
      },
      {
        nombre: '8"x2"'
      }
      ].map(data => Tipo.create(data))

      return Promise.all(creatingTipos)
        .then(createdTipos => {
          tipoExample = createdTipos[0]
        })
    })

    /**
     * This is a proper GET /api/tipos/tipoId req where we search by the ID of the tipo created above
     */
    it('returns the JSON of the tipo based on the id', () => {
      return agent
        .get('/api/tipos/' + tipoExample.id)
        .expect(200)
        .expect((res) => {
          if (typeof res.body === 'string') {
            res.body = JSON.parse(res.body)
          }
          expect(res.body[0].nombre).to.equal('4"x2"')
        })
    })
    it('returns a 404 error if the ID is not valid', () => {
      return agent
        .get('/api/tipos/347890')
        .expect(404)
    })
  })


})
