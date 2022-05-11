require('dotenv').config()

const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')

// connect to mongodb
require('./mongo')

// import module notes
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const userRouter = require('./controllers/users')
const noteRouter = require('./controllers/notes')
// notes

app.use(express.json())

app.use(logger)

app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.use('/api/notes', noteRouter)

app.use('/api/users', userRouter)

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})

module.exports = { app, server }
