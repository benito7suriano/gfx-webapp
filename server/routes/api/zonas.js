const router = require('express').Router()
const { Zona } = require('../../db')

module.exports = router

// GET /api/zonas
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

// POST /api/zona
router.post('/', async (req, res, next) => {
  try {
    const zona = await Zona.create(req.body)
    res.json(zona)
  } catch (err) {
    next(err)
  }
})

// PUT /api/zona/zonaId
router.put('/:zonaId', async (req, res, next) => {
  try {
    const zonaId = req.params.zonaId
    const zona = await Zona.findById(zonaId)

    if (!zona) return res.sendStatus(404)

    const updated = await zona.update(req.body)

    res.status(200).json({ zona: updated, message: 'Updated successfully' }).end()
  } catch (err) {
    next(err)
  }
})

// DELETE api/zona/zonaId
router.delete('/:zonaId', async (req, res, next) => {
  try {
    const zonaId = req.params.zonaId
    await Zona.destroy({ where: { id: zonaId } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

