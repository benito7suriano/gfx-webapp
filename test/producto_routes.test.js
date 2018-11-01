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

  // GET productos by Id
  describe('GET /api/productos/:productoId', () => {
    let productoExample

    beforeEach(() => {
      let creatingProductos = [{
        nombre: 'GHT',
        descripcion: 'lorem ipsum dolorem'
      },
      {
        nombre: 'ZincAlum',
        descripcion: 'lorem ipsum dolorem'
      },
      {
        nombre: 'HMX',
        descripcion: 'lorem ipsum dolorem'
      }
      ].map(data => Producto.create(data))

      return Promise.all(creatingProductos)
        .then(createdProductos => {
          productoExample = createdProductos[0]
        })
    })

    /**
     * This is a proper GET /api/productos/productoId req where we search by the ID of the producto created above
     */
    it('returns the JSON of the producto based on the id', () => {
      return agent
        .get('/api/productos/' + productoExample.id)
        .expect(200)
        .expect((res) => {
          if (typeof res.body === 'string') {
            res.body = JSON.parse(res.body)
          }
          expect(res.body[0].nombre).to.equal('GHT')
        })
    })
    it('returns a 404 error if the ID is not valid', () => {
      return agent
        .get('/api/productos/347890')
        .expect(404)
    })
  })

  // POST new productos
  describe('POST /productos', () => {
    /**
     * Testing the creation of a new producto
     * Here we don't get back just the producto, we get back an object of this type, which we construct:
     * {
     *    nombre: 'GHT'
     * }
     */

    it('creates a new producto', () => {
      return agent
        .post('/api/productos')
        .send({
          nombre: 'GHT',
          descripcion: 'lorem ipsum dolorem'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.nombre).to.equal('GHT')
          expect(res.body.id).to.not.be.an('undefined')
        })
    })

    it('doesn\'t create an instance without allowNull: false fields', () => {
      return agent
        .post('/api/productos')
        .send({
          nombre: null
        })
        .expect(500)
    })

    // check if the productos were actually saved to the db
    it('saves the producto to the db', () => {
      return agent
        .post('/api/productos')
        .send({
          nombre: 'GHT',
          descripcion: 'lorem ipsum dolorem'
        })
        .expect(200)
        .then(() => {
          return Producto.findOne({
            where: { nombre: 'GHT' }
          })
        }).then((found) => {
          expect(found).to.exist // eslint-disable-line no-unused-expressions
          expect(found.nombre).to.equal('GHT')
        })
    })
    // do not assume that aysnc ops (like db writes) will work; always check
    it('sends back JSON of the actual created producto, not just the POSTed data', () => {

      return agent
        .post('/api/productos')
        .send({
          nombre: 'ZincAlum',
          descripcion: 'lorem'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.extraneous).to.be.an('undefined')
          expect(res.body.createdAt).to.exist // eslint-disable-line no-unused-expressions
        })
    })
  })
})
