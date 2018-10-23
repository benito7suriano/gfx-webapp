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

  // POST new países
  describe('POST /paises', () => {
    /**
     * Testing the creation of a new pais
     * Here we don't get back just the pais, we get back an object of this type, which we construct:
     * {
     *    nombre: 'Nicaragua'
     * }
     */

    it('creates a new pais', () => {
      return agent
        .post('/api/paises')
        .send({
          nombre: 'Nicaragua'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.nombre).to.equal('Nicaragua')
          expect(res.body.id).to.not.be.an('undefined')
        })
    })

    it('doesn\'t create an instance without allowNull: false fields', () => {
      return agent
        .post('/api/paises')
        .send({
          nombre: null
        })
        .expect(500)
    })

    // check if the paises were actually saved to the db
    it('saves the pais to the db', () => {
      return agent
        .post('/api/paises')
        .send({
          nombre: 'Nicaragua'
        })
        .expect(200)
        .then(() => {
          return Pais.findOne({
            where: { nombre: 'Nicaragua' }
          })
        }).then((found) => {
          expect(found).to.exist // eslint-disable-line no-unused-expressions
          expect(found.nombre).to.equal('Nicaragua')
        })
    })
    // do not assume that aysnc ops (like db writes) will work; always check
    it('sends back JSON of the actual created pais, not just the POSTed data', () => {

      return agent
        .post('/api/paises')
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

  // PUT países by Id
  describe('PUT /paises/:id', () => {
    let pais

    beforeEach(() => {
      return Pais.create({
        nombre: 'El Salvador'
      }).then((created) => {
        pais = created
      })
    })

    /**
     * Test the updating of a pais
     * Here we don't get back just the article, we get back an object of this type, which we construct:
     * {
     *    nombre: 'El Salvador'
        }
     *
     */

    it('updates a pais', () => {
      return agent
        .put('/api/paises/' + pais.id)
        .send({
          nombre: 'China'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).to.equal('Updated successfully')
          expect(res.body.pais.nombre).to.equal('China')
        })
    })

    it('saves updates to the db', () => {
      return agent
        .put('/api/paises/' + pais.id)
        .send({
          nombre: 'China'
        })
        .then(() => {
          return Pais.findById(pais.id)
        })
        .then((found) => {
          expect(found).to.exist // eslint-disable-line
          expect(found.nombre).to.equal('China')
        })
    })

    it('gets 500 for invalid updates', () => {
      return agent
        .put('/api/paises/' + pais.id)
        .send({ nombre: null })
        .expect(500)
    })
  })

  // DELETE países
  describe('DELETE /paises/:id', () => {
    let paisExample

    beforeEach(() => {
      let creatingPaises = [{
        nombre: 'El Salvador'
      }, {
        nombre: 'Guatemala'
      }, {
          nombre: 'Nicaragua'
      }
      ].map(data => Pais.create(data))

      return Promise.all(creatingPaises)
        .then(createdPaises => {
          paisExample = createdPaises[0]
        })
    })

    /**
     * Delete one of the paises and check that the array is reduced to a size that conveys only the remaining entries
     */

    it('responds with a 204 after successfully DELETEing', () => {
      return agent
        .delete('/api/paises/' + paisExample.id)
        .expect(204)
    })
  })
})
