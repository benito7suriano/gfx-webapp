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

  // POST new tipos
  describe('POST /tipos', () => {
    /**
     * Testing the creation of a new tipo
     * Here we don't get back just the tipo, we get back an object of this type, which we construct:
     * {
     *    nombre: '4"x2"'
     * }
     */

    it('creates a new tipo', () => {
      return agent
        .post('/api/tipos')
        .send({
          nombre: '4"x2"'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.nombre).to.equal('4"x2"')
          expect(res.body.id).to.not.be.an('undefined')
        })
    })

    it('doesn\'t create an instance without allowNull: false fields', () => {
      return agent
        .post('/api/tipos')
        .send({
          nombre: null
        })
        .expect(500)
    })

    // check if the tipos were actually saved to the db
    it('saves the tipo to the db', () => {
      return agent
        .post('/api/tipos')
        .send({
          nombre: '4"x2"'
        })
        .expect(200)
        .then(() => {
          return Tipo.findOne({
            where: { nombre: '4"x2"' }
          })
        }).then((found) => {
          expect(found).to.exist // eslint-disable-line no-unused-expressions
          expect(found.nombre).to.equal('4"x2"')
        })
    })
    // do not assume that aysnc ops (like db writes) will work; always check
    it('sends back JSON of the actual created tipo, not just the POSTed data', () => {

      return agent
        .post('/api/tipos')
        .send({
          nombre: '4"x2"'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.extraneous).to.be.an('undefined')
          expect(res.body.createdAt).to.exist // eslint-disable-line no-unused-expressions
        })
    })
  })

  // PUT tipos
  describe('PUT /tipos/:id', () => {
    let tipo

    beforeEach(() => {
      return Tipo.create({
        nombre: '4"x2"'
      }).then((created) => {
        tipo = created
      })
    })

    /**
     * Test the updating of a tipo
     * Here we don't get back just the article, we get back an object of this type, which we construct:
     * {
     *    nombre: '4"x2"'
        }
     *
     */

    it('updates a tipo', () => {
      return agent
        .put('/api/tipos/' + tipo.id)
        .send({
          nombre: '4"x2"'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).to.equal('Updated successfully')
          expect(res.body.tipo.nombre).to.equal('4"x2"')
        })
    })

    it('saves updates to the db', () => {
      return agent
        .put('/api/tipos/' + tipo.id)
        .send({
          nombre: '4"x2"'
        })
        .then(() => {
          return Tipo.findById(tipo.id)
        })
        .then((found) => {
          expect(found).to.exist // eslint-disable-line
          expect(found.nombre).to.equal('4"x2"')
        })
    })

    it('gets 500 for invalid updates', () => {
      return agent
        .put('/api/tipos/' + tipo.id)
        .send({ nombre: null })
        .expect(500)
    })
  })

  // DELETE tipos
  describe('DELETE /tipos/:id', () => {
    let tipoExample

    beforeEach(() => {
      let creatingTipos = [{
        nombre: '4"x2"'
      }, {
        nombre: '6"x2"'
      }, {
        nombre: '8"x2"'
      }
      ].map(data => Tipo.create(data))

      return Promise.all(creatingTipos)
        .then(createdtipos => {
          tipoExample = createdtipos[0]
        })
    })

    /**
     * Delete one of the tipos and check that the array is reduced to a size that conveys only the remaining entries
     */

    it('responds with a 204 after successfully DELETEing', () => {
      return agent
        .delete('/api/tipos/' + tipoExample.id)
        .expect(204)
    })
  })
})
