const router = require('express').Router()
const { User } = require('../../db')

module.exports = router

// GET api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

// GET /api/users/userId
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findAll({where: { id: userId }})
    if(user.length === 0) {
      res.sendStatus(404)
    } else {
      res.json(user)
    }
  } catch(err) {
    next(err)
  }
})

// POST /api/users
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

// PUT /api/users/userId
router.put('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)

    if(!user) return res.sendStatus(404)

    const updated = await user.update(req.body)

    res.status(200).json({ centro: updated, message: 'Updated successfully '}).end()
  } catch (err) {
    next(err)
  }
})

// DELETE /api/users/userId
router.delete('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId
    await User.destroy({ where: {id: userId} })
    res.status(204).end()
  } catch(err) {
    next(err)
  }
})

