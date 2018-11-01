'use strict'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../server/app')
const agent = request.agent(app)

const { db, Producto } = require('../server/db')

// Producto Routes Tests

describe('Producto routes: ', () => {
  // First we clear the db before beginning each run

  before(() => {
    return db.sync({ force: true })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      Producto.truncate({ cascade: true })
    ])
  })

  // GET all productos
  describe('GET /productos', () => {
    /* We'll run a GET req to /productos

    1. It should return JSON (i.e.: use res.json)
    2. Because there isn't anything in the DB, it should be an empty array
    */

    it('responds with an array via JSON', () => {
      return agent
        .get('/api/productos')
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
    * Save an new producto in the db using model and then retrieve it using the GET /productos route
    *
     */

    it('returns a producto if there is one in the db', () => {
    let producto = Producto.build({
        nombre: 'GHT',
        descripcion: 'lorem ispum dolorem'
      })

      return producto.save().then(() => {

        return agent
          .get('/api/productos')
          .expect(200)
          .expect((res) => {
            expect(res.body)
              .to.be.an.instanceOf(Array)
            expect(res.body[0].nombre)
              .to.equal('GHT')
          })
      })
    })

    /*
    * Save a second article in the db using our model, then retrieve it using the GET /api/productos route
    */
    it('returns another producto if there is one in the db', () => {
      let producto1 = Producto.build({
        nombre: 'GHT',
        descripcion: 'lorem ispum dolorem'
      })
      let producto2 = Producto.build({
        nombre: 'ZincAlum',
        descripcion: 'lorem ispum dolorem'
      })

      return producto1.save()
        .then(() => {
          return producto2.save()
        })
        .then(() => {
          return agent
            .get('/api/productos')
            .expect(200)
            .expect((res) => {
              expect(res.body)
                .to.be.an.instanceOf(Array)
              expect(res.body[0].nombre)
                .to.equal('GHT')
              expect(res.body[1].nombre)
                .to.equal('ZincAlum')
            })
        })
    })
  })
})
