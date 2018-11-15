const router = require('express').Router()
module.exports = router

// Routes go here!
// NOTE: Any routes that you put here are ALREADY mounted on `/api`
// You can put all routes in this file HOWEVER,
// this file should almost be like a table of contents for the routers you create!
router.use('/centros', require('./centros'))
router.use('/users', require('./users'))
router.use('/paises', require('./paises'))
router.use('/zonas', require('./zonas'))
router.use('/productos', require('./productos'))
router.use('/tipos', require('./tipos'))

// If someone makes a req that starts with `/api`,
// but you DON'T have a corresponding router, this piece of
// middleware will generate a 404, and send it to your error-handling endware!

router.use((req, res, next) => {
  const err = new Error('API route not found!')
  err.status = 404
  next(err)
})
