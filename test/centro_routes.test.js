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
        expect(res.body[0].nombre).to.equal('GFX Center 1')
      })
    })
    it('returns a 404 error if the ID is not correct', () => {
      return agent
      .get('/api/articles/123')
      .expect(404)
    })
  })

  /**
   * Test the post routes for centros
   */

  describe('POST /centros', () => {
    /**
     * Testing the creation of a new centro
     * Here we don't get back just the centro, we get back an object of this type, which we construct:
     * {
     *    nombre: NEW
     *    direccion: 7777 Street, City City
     *    cluster: Centerfold
     *    pais: El Salvador
     *    telarea: 503
     *    telnum: 2212 7777
     *    email: new@grupoferromax.com
     * }
     */

     it('creates a new centro', () => {
       return agent
       .post('/api/centros')
       .send({
          nombre: 'NEW',
          direccion: '7777 Street, City City',
          cluster: 'Centerfold',
          pais: 'El Salvador',
          telarea: 503,
          telnum: 22127777,
          email: 'new@grupoferromax.com'
       })
       .expect(200)
       .expect((res) => {
         expect(res.body.nombre).to.equal('NEW')
         expect(res.body.id).to.not.be.an('undefined')
         expect(res.body.cluster).to.equal('Centerfold')
       })
     })

    it('doesn\'t create an article without allowNull: false fields', () => {
      return agent
      .post('/api/centros')
      .send({
        nombre: 'NAC'
      })
      .expect(500)
    })

    // check if the centros were actually saved to the db
    it('saves the centro to the db', () => {
      return agent
      .post('/api/centros')
      .send({
        nombre: 'NEW',
        direccion: '7777 Street, City City',
        cluster: 'Centerfold',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22127777,
        email: 'new@grupoferromax.com'
      })
      .expect(200)
      .then(() => {
        return Centro.findOne({
          where: { nombre: 'NEW'}
        })
      }).then((found) => {
        expect(found).to.exist // eslint-disable-line no-unused-expressions
        expect(found.pais).to.equal('El Salvador')
      })
    })
    // do not assume that aysnc ops (like db writes) will work; always check
    it('sends back JSON of the actual created centro, not just the POSTed data', () => {

      return agent
      .post('/api/centros')
      .send({
        nombre: 'NEW',
        direccion: '7777 Street, City City',
        cluster: 'Centerfold',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22127777,
        email: 'new@grupoferromax.com',
        extraneous: 'Bla bla bla'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.extraneous).to.be.an('undefined')
        expect(res.body.createdAt).to.exist // eslint-disable-line no-unused-expressions
      })
    })
  })

  /**
   * Series of specs to test updating of Centros using a PUT req to /centros/:id
   *
   */
  describe('PUT /centros/:id', () => {
    let centro

    beforeEach(() => {
      return Centro.create({
        nombre: 'NEW',
        direccion: '7777 Street, City City',
        cluster: 'Centerfold',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22127777,
        email: 'new@grupoferromax.com'
      }).then((created) => {
        centro = created
      })
    })

    /**
     * Test the updating of a centro
     * Here we don't get back just the artcile, we get back an object of this type, which we construct:
     * {
     *    nombre: 'NEW',
          direccion: '7777 Street, City City',
          cluster: 'Centerfold',
          pais: 'El Salvador',
          telarea: 503,
          telnum: 22127777,
          email: 'new@grupoferromax.com'
        }
     *
     */

    it('updates a centro', () => {
      return agent
      .put('/api/centros/' + centro.id)
      .send({
        nombre: 'NNN',
        direccion: '7777 Street, City City',
        cluster: 'Centerfold',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22127777,
        email: 'new@grupoferromax.com'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.message).to.equal('Updated successfully')
        expect(res.body.centro.nombre).to.equal('NNN')
      })
    })

    it('saves updates to the db', () => {
      return agent
      .put('/api/centros/' + centro.id)
      .send({
        nombre: 'NNN',
        direccion: '7777 Street, City City',
        cluster: 'Centerfold',
        pais: 'El Salvador',
        telarea: 503,
        telnum: 22127777,
        email: 'new@grupoferromax.com'
      })
      .then(() => {
        return Centro.findById(centro.id)
      })
      .then((found) => {
        expect(found).to.exist // eslint-disable-line
        expect(found.nombre).to.equal('NNN')
      })
    })

    it('gets 500 for invalid updates', () => {
      return agent
      .put('/api/centros/' + centro.id)
      .send({ nombre: null })
      .expect(500)
    })
  })

  /**
   *
   * Test the delete route for the Centro model
   *
   * */

  describe('DELETE /centros/:id', () => {
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
     * Delete one of the centros and check that the array is reduced to a size that conveys only the remaining entries
     */

     it('responds with a 204 after successfully DELETEing', () => {
       return agent
       .delete('/api/centros/' + centroExample.id)
       .expect(204)
     })
  })
})
