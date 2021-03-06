const userRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
  const user = await User.find({}).populate('notes', {
    content: 1,
    date: 1
  })
  res.json(user)
})

userRouter.post('/', async (req, res) => {
  try {
    const { username, name, password } = req.body

    const saltRounnds = 10
    const passwordHash = await bcrypt.hash(password, saltRounnds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = userRouter
