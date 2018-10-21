const router = require('express').Router()
const { Centro } = require('../../db/')

module.exports = router

// GET api/centros
router.get('/', async (req, res, next) => {
  try {
    const centros = await Centro.findAll()
    res.json(centros)
  } catch (err) {
    next(err)
  }
})

// GET /api/centros/centroId
router.get('/:centroId', async (req, res, next) => {
  try {
    const centroId = req.params.centroId
    const centro = await Centro.findAll({where: { id: centroId } })
    if(centro.length === 0) {
      res.sendStatus(404)
    } else {
      res.json(centro)
    }
  } catch (err) {
    next (err)
  }
})

// POST /api/centros
router.post('/', async (req, res, next) => {
  try {
    const centro = await Centro.create(req.body)
    res.json(centro)
  } catch (err) {
    next(err)
  }
})

// PUT /api/centros/centroId
router.put('/:centroId', async (req, res, next) => {
  try {
    const centroId = req.params.centroId
    const centro = await Centro.findById(centroId)

    if(!centro) return res.sendStatus(404)

    const updated = await centro.update(req.body)

    res.status(200).json({ centro: updated, message: 'Updated successfully' }).end()
  } catch (err) {
    next(err)
  }
})

// DELETE api/centros/centroId
router.delete('/:centroId', async (req, res, next) => {
  try {
    const centroId = req.params.centroId
    await Centro.destroy({ where: {id: centroId } })
    res.status(204).end()
  } catch (err) {
    next (err)
  }
})

