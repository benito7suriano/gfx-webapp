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

// GET /api/zona/zonaId
router.get('/:zonaId', async (req, res, next) => {
  try {
    const zonaId = req.params.zonaId
    const zona = await Zona.findAll({ where: { id: zonaId } })
    if (zona.length === 0) {
      res.sendStatus(404)
    } else {
      res.json(zona)
    }
  } catch (err) {
    next(err)
  }
})

