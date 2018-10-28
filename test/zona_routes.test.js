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

  // GET zonas by Id
  describe('GET /api/zonas/:zonaId', () => {
    let zonaExample

    beforeEach(() => {
      let creatingZonas = [{
        nombre: 'San Salvador'
      },
      {
        nombre: 'La Libertad'
      },
      {
        nombre: 'Santa Ana'
      }
      ].map(data => Zona.create(data))

      return Promise.all(creatingZonas)
        .then(createdZonas => {
          zonaExample = createdZonas[0]
        })
    })

    /**
     * This is a proper GET /api/zonas/zonaId req where we search by the ID of the zona created above
     */
    it('returns the JSON of the zona based on the id', () => {
      return agent
        .get('/api/zonas/' + zonaExample.id)
        .expect(200)
        .expect((res) => {
          if (typeof res.body === 'string') {
            res.body = JSON.parse(res.body)
          }
          expect(res.body[0].nombre).to.equal('San Salvador')
        })
    })
    it('returns a 404 error if the ID is not valid', () => {
      return agent
        .get('/api/zonas/347890')
        .expect(404)
    })
  })

  // POST new zonas
  describe('POST /zonas', () => {
    /**
     * Testing the creation of a new zona
     * Here we don't get back just the zona, we get back an object of this type, which we construct:
     * {
     *    nombre: 'Usulután'
     * }
     */

    it('creates a new zona', () => {
      return agent
        .post('/api/zonas')
        .send({
          nombre: 'Usulután'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.nombre).to.equal('Usulután')
          expect(res.body.id).to.not.be.an('undefined')
        })
    })

    it('doesn\'t create an instance without allowNull: false fields', () => {
      return agent
        .post('/api/zonas')
        .send({
          nombre: null
        })
        .expect(500)
    })

    // check if the zonas were actually saved to the db
    it('saves the zona to the db', () => {
      return agent
        .post('/api/zonas')
        .send({
          nombre: 'Usulután'
        })
        .expect(200)
        .then(() => {
          return Zona.findOne({
            where: { nombre: 'Usulután' }
          })
        }).then((found) => {
          expect(found).to.exist // eslint-disable-line no-unused-expressions
          expect(found.nombre).to.equal('Usulután')
        })
    })
    // do not assume that aysnc ops (like db writes) will work; always check
    it('sends back JSON of the actual created zona, not just the POSTed data', () => {

      return agent
        .post('/api/zonas')
        .send({
          nombre: 'Nicaragua'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.extraneous).to.be.an('undefined')
          expect(res.body.createdAt).to.exist // eslint-disable-line no-unused-expressions
        })
    })
  })


})

