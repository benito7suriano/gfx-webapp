'use strict'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../server/app')
const agent = request.agent(app)

const { db, User } = require('../server/db')

// User Route Tests

describe('User routes:', () => {
  // First we clear the db before beginning each run

  before(() => {
    return db.sync({ force: true })
  })

  // Also, we empty the tables after each spec
  afterEach(() => {
    return Promise.all([
      User.truncate({ cascade: true })
    ])
  })

  describe('GET /users', () => {
    /**
     * We'll run a GET req to /users
     *
     * 1. It should return a JSON (i.e.: use res.json)
     * 2. Becuase there isn't anything in the DB, it should be an empty array
     *
     * */

     it('responds w/ an array via JSON', () => {
       return agent
       .get('/api/users')
       .set('Accept', 'application/json')
       .expect('Content-type', /json/)
       .expect(200)
       .expect((res) => {
        //  res.bodyis the JSON return object
        expect(res.body).to.be.an.instanceOf(Array)
        expect(res.body).to.have.length(0)
       })
     })

     /**
      * Saves a new user in the db using model and then retrieves it using the GET /users route
      *
      */
     it('returns a user if there is one the in the db', () => {
       let user = User.build({
         nombre: 'Juana',
         apellido: 'Lamengana',
         telarea: 503,
         telnum: 78561268,
         email: 'juana@gmail.com',
         empresa: 'La Peor es Nada',
         subscripcion: false
       })

       return user.save().then(() => {
         return agent
         .get('/api/users')
         .expect(200)
         .expect((res) => {
           expect(res.body)
           .to.be.an.instanceOf(Array)
           expect(res.body[0].nombre)
           .to.equal('Juana')
         })
       })
     })

     /**
      * Save a second user in the db using our model, then retrieve it using the GET /api/users route
      */

     it('returns another user if there is one in the db', () => {
       let user1 = User.build({
         nombre: 'Juana',
         apellido: 'Lamengana',
         telarea: 503,
         telnum: 78561268,
         email: 'juana@gmail.com',
         empresa: 'La Peor es Nada',
         subscripcion: false
       })

       let user2 = User.build({
         nombre: 'Don',
         apellido: 'Juan',
         telarea: 503,
         telnum: 78590358,
         email: 'juanito@gmail.com',
         empresa: 'Resaca FM',
         subscripcion: true
       })

       return user1.save()
       .then(() => {
         return user2.save()
       })
       .then(() => {
         return agent
         .get('/api/users')
         .expect(200)
         .expect((res) => {
           expect(res.body)
           .to.be.an.instanceOf(Array)
           expect(res.body[0].nombre)
           .to.equal('Juana')
           expect(res.body[1].nombre)
           .to.equal('Don')
         })
       })
     })
  })

  // test the search for users by id
  describe('GET /users/:userId', () => {
    let userExample

    beforeEach(() => {
      let creatingUsers = [{
        nombre: 'Juana',
        apellido: 'Lamengana',
        telarea: 503,
        telnum: 78561268,
        email: 'juana@gmail.com',
        empresa: 'La Peor es Nada',
        subscripcion: false
      }, {
        nombre: 'Héctor',
        apellido: 'Elfader',
        telarea: 503,
        telnum: 2277777,
        email: 'hector@gmail.com',
        empresa: 'La Industria Inc',
        subscripcion: false
      }, {
          nombre: 'Ermenegildo',
          apellido: 'Ozuna',
          telarea: 503,
          telnum: 22301010,
          email: 'ozuuuna@gmail.com',
          empresa: 'Negros y Claros',
          subscripcion: false
      }].map(data => User.create(data))

      return Promise.all(creatingUsers)
      .then(createdUsers => {
        userExample = createdUsers[0]
      })
    })

    /**
       * This is a proper GET /api/users/userId req where we search by the ID of the user created above
       */

    it('returns the JSON of the user based on the id', () => {
      return agent
      .get('/api/users/', + userExample.id)
      .expect(200)
      .expect(res => {
        if(typeof res.body === 'string') {
          res.body = JSON.parse(res.body)
        }
        expect(res.body[0].nombre).to.equal('Juana')
      })
    })

    it('returns a 404 error if the ID is not valid', () => {
      return agent
      .get('/api/users/123')
      .expect(404)
    })
  })

  // test the post routes for users
  describe('POST /users', () => {
    /**
     * Testing the creation of a new user
     * Here, we don't just get back the user, we get back an object of this type, which we construct:
     * {
     *    nombre: 'Benito',
     *    apellido: 'Suriano',
     *    telarea: 503,
     *    telnum: 23980530,
     *    email: benito@galvanissa.com,
     *    empresa: 'Grupo Ferromax',
     *    subscripcion: true
     *
     * }
     */

    it('creates a new user', () => {
      return agent
        .post('/api/users')
        .send({
          nombre: 'Benito',
          apellido: 'Suriano',
          telarea: 503,
          telnum: 23980530,
          email: 'benito@galvanissa.com',
          empresa: 'Grupo Ferromax',
          subscripcion: true
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.nombre).to.equal('Benito')
          expect(res.body.id).to.not.be.an('undefined')
          expect(res.body.subscripcion).to.equal(true)
        })
    })
  })

  it('doesn\'t create an instance without allowNull: false fields', () => {
    return agent
      .post('/api/users')
      .send({
        nombre: 'NAC'
      })
      .expect(500)
  })

  // check if the users were actually saved to the db
  it('saves the user to the db', () => {
    return agent
      .post('/api/users')
      .send({
        nombre: 'Benito',
        apellido: 'Suriano',
        telarea: 503,
        telnum: 23980530,
        email: 'benito@galvanissa.com',
        empresa: 'Grupo Ferromax',
        subscripcion: true
      })
      .expect(200)
      .then(() => {
        return User.findOne({
          where: { nombre: 'Benito' }
        })
      }).then((found) => {
        expect(found).to.exist // eslint-disable-line no-unused-expressions
        expect(found.empresa).to.equal('Grupo Ferromax')
      })
  })

  // do not assume that aysnc ops (like db writes) will work; always check
  it('sends back JSON of the actual created user, not just the POSTed data', () => {

    return agent
      .post('/api/users')
      .send({
        nombre: 'Benito',
        apellido: 'Suriano',
        telarea: 503,
        telnum: 23980530,
        email: 'benito@galvanissa.com',
        empresa: 'Grupo Ferromax',
        subscripcion: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.extraneous).to.be.an('undefined')
        expect(res.body.createdAt).to.exist // eslint-disable-line no-unused-expressions
      })
  })
})
