const router = require('express').Router()
const { Zona } = require('../../db')

module.exports = router

// GET api/zona
router.get('/', async (req, res, next) => {
  try {
    const zona = await Zona.findAll()
    res.json(zona)
  } catch (err) {
    next(err)
  }
})

