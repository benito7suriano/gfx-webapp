const router = require('express').Router()
const { Pais } = require('../../db')

module.exports = router

// GET api/pais
router.get('/', async (req, res, next) => {
  try {
    const pais = await Pais.findAll()
    res.json(pais)
  } catch (err) {
    next(err)
  }
})

// GET /api/pais/paisId
router.get('/:paisId', async (req, res, next) => {
  try {
    const paisId = req.params.paisId
    const pais = await Pais.findAll({ where: { id: paisId } })
    if (pais.length === 0) {
      res.sendStatus(404)
    } else {
      res.json(pais)
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/pais
router.post('/', async (req, res, next) => {
  try {
    const pais = await Pais.create(req.body)
    res.json(pais)
  } catch (err) {
    next(err)
  }
})

// PUT /api/pais/paisId
router.put('/:paisId', async (req, res, next) => {
  try {
    const paisId = req.params.paisId
    const pais = await Pais.findById(paisId)

    if (!pais) return res.sendStatus(404)

    const updated = await pais.update(req.body)

    res.status(200).json({ pais: updated, message: 'Updated successfully' }).end()
  } catch (err) {
    next(err)
  }
})

// DELETE api/pais/paisId
router.delete('/:paisId', async (req, res, next) => {
  try {
    const paisId = req.params.paisId
    await Pais.destroy({ where: { id: paisId } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

