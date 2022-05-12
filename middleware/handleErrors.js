const handleErrors = {
  CastError: (res) => res.status(400).send({ error: 'id used is malformed' }),

  ValidationError: (res, error) =>
    res.status(409).send({
      error: error.message
    }),
  JsonWebTokenError: (res) =>
    res.status(401).send({ error: 'token missing or invalid' }),
  TokenExpiredError: (res) => res.status(401).send({ error: 'token expired' }),
  defaultError: (res) => res.status(500).end()
}

module.exports = (error, req, res, next) => {
  console.log(error.name)
  const handler = handleErrors[error.name] || handleErrors.defaultError
  handler(res, error)
}
