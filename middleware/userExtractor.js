const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  const authorization = req.get('Authorization')
  let token = null
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const { id: userId } = decodedToken
  req.userId = userId
  next()
}