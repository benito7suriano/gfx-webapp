'use strict'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../server/app')
const agent = request.agent(app)

const { db, Centro } = require('../server/db')

/* Centro Route Tests */

describe('Centro routes:', () => {
  // First we clear the db before beginning each run

  before(() => {
    return db.sync({ force: true })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Centro.truncate({ cascade: true })
    ])
  })

  describe('GET /centros', () => {
    /* We'll run a GET req to /centros

    1. It should return JSON (i.e.: use res.json)
    2. Because there isn't anything in the DB, it should be an empty array
    */

    it('responds with an array via JSON', () => {
      return agent
      .get('/api/centros')
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
    * Save an new centro in the db using model and then retrieve it using the GET /centros route
    *
     */

    it('returns a centro if there is one in the db', () => {
      let centro = Centro.build({
        nombre: 'GFX Center',
        direccion: '1234 Blvd Road, Galvanized St.',
        cluster: 'Midcenter',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22120000,
        email: 'gfx@grupoferromax.com'
      })

      return centro.save().then(() => {

        return agent
        .get('/api/centros')
        .expect(200)
        .expect((res) => {
          expect(res.body)
          .to.be.an.instanceOf(Array)
          expect(res.body[0].nombre)
          .to.equal('GFX Center')
        })
      })
    })

    /*
    * Save a second article in the db using our modle, then retrieve it using the GET /api/centros route
    */
    it('returns another centro if there is one in the db', () => {
      let centro1 = Centro.build({
        nombre: 'GFX Center',
        direccion: '1234 Blvd Road, Galvanized St.',
        cluster: 'Midcenter',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22120000,
        email: 'gfx@grupoferromax.com'
      })
      let centro2 = Centro.build({
        nombre: 'GFX NOT Center',
        direccion: '1234 Blvd Road, Galvanized St.',
        cluster: 'Midcenter',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22120000,
        email: 'gfx@grupoferromax.com'
      })

      return centro1.save()
      .then(() => {
        return centro2.save()
      })
      .then(() => {
        return agent
        .get('/api/centros')
        .expect(200)
        .expect((res) => {
          expect(res.body)
          .to.be.an.instanceOf(Array)
          expect(res.body[0].nombre)
          .to.equal('GFX Center')
          expect(res.body[1].nombre)
          .to.equal('GFX NOT Center')
        })
      })
    })
  })

  /**
   * Search for centros by Id
  */
  describe('GET /api/centros/:centroId', () => {
    let centroExample

    beforeEach(() => {
      let creatingCentros = [{
        nombre: 'GFX Center 1',
        direccion: '1234 Blvd Road, Galvanized St.',
        cluster: 'Midcenter',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22120000,
        email: 'gfx@grupoferromax.com'
      },
      {
        nombre: 'GFX Center 2',
        direccion: '1234 Blvd Road, Galvanized St.',
        cluster: 'Midcenter',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22120000,
        email: 'gfx@grupoferromax.com'
      },
      {
        nombre: 'GFX Center 3',
        direccion: '1234 Blvd Road, Galvanized St.',
        cluster: 'Midcenter',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22120000,
        email: 'gfx@grupoferromax.com'
      }
    ].map(data => Centro.create(data))

    return Promise.all(creatingCentros)
    .then(createdCentros => {
      centroExample = createdCentros[0]
      })
    })

    /**
     * This is a proper GET /api/centros/centroId req where we search by the ID of the centro created above
     */
    it('returns the JSON of the centro based on the id', () => {
      return agent
      .get('/api/centros/' + centroExample.id)
      .expect(200)
      .expect((res) => {
        if(typeof res.body === 'string') {
          res.body = JSON.parse(res.body)
        }
        console.log('This is res.body: ', res.body)
        expect(res.body[0].nombre).to.equal('GFX Center 1')
      })
    })
  })

})
