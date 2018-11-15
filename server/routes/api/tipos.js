const router = require('express').Router()
const { Tipo } = require('../../db')

module.exports = router

// GET api/tipo
router.get('/', async (req, res, next) => {
  try {
    const tipo = await Tipo.findAll()
    res.json(tipo)
  } catch (err) {
    next(err)
  }
})

// GET /api/tipo/tipoId
router.get('/:tipoId', async (req, res, next) => {
  try {
    const tipoId = req.params.tipoId
    const tipo = await Tipo.findAll({ where: { id: tipoId } })
    if (tipo.length === 0) {
      res.sendStatus(404)
    } else {
      res.json(tipo)
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/tipo
router.post('/', async (req, res, next) => {
  try {
    const tipo = await Tipo.create(req.body)
    res.json(tipo)
  } catch (err) {
    next(err)
  }
})

// PUT /api/tipo/tipoId
router.put('/:tipoId', async (req, res, next) => {
  try {
    const tipoId = req.params.tipoId
    const tipo = await Tipo.findById(tipoId)

    if (!tipo) return res.sendStatus(404)

    const updated = await tipo.update(req.body)

    res.status(200).json({ tipo: updated, message: 'Updated successfully' }).end()
  } catch (err) {
    next(err)
  }
})

// DELETE api/tipo/tipoId
router.delete('/:tipoId', async (req, res, next) => {
  try {
    const tipoId = req.params.tipoId
    await Tipo.destroy({ where: { id: tipoId } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

