const router = require('express').Router()
const { Producto } = require('../../db')

module.exports = router

// GET api/producto
router.get('/', async (req, res, next) => {
  try {
    const producto = await Producto.findAll()
    res.json(producto)
  } catch (err) {
    next(err)
  }
})

// GET /api/producto/productoId
router.get('/:productoId', async (req, res, next) => {
  try {
    const productoId = req.params.productoId
    const producto = await Producto.findAll({ where: { id: productoId } })
    if (producto.length === 0) {
      res.sendStatus(404)
    } else {
      res.json(producto)
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/producto
router.post('/', async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body)
    res.json(producto)
  } catch (err) {
    next(err)
  }
})

// PUT /api/producto/productoId
router.put('/:productoId', async (req, res, next) => {
  try {
    const productoId = req.params.productoId
    const producto = await Producto.findById(productoId)

    if (!producto) return res.sendStatus(404)

    const updated = await producto.update(req.body)

    res.status(200).json({ producto: updated, message: 'Updated successfully' }).end()
  } catch (err) {
    next(err)
  }
})

// DELETE api/producto/productoId
router.delete('/:productoId', async (req, res, next) => {
  try {
    const productoId = req.params.productoId
    await Producto.destroy({ where: { id: productoId } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

