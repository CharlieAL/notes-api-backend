const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRoute = require('express').Router()
const User = require('../models/User')

loginRoute.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    res.status(401).json({
      error: 'Wrong password or wrong username'
    })
  } else {
    const userForToken = {
      id: user._id,
      username: user.username
    }

    const token = jwt.sign(userForToken, process.env.TOKEN_SECRET)

    res.send({
      name: user.name,
      username: user.username,
      token
    })
  }
})

module.exports = loginRoute
