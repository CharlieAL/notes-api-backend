require('dotenv').config()

const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')

// connect to mongodb
require('./mongo')

// import module notes
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

// notes

app.use(express.json())

app.use(logger)

app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => {
      next(err)
    })
})
app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important || false
  }
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      res.json(result)
    })
    .catch((err) => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  Note.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((err) => next(err))
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note.content) {
    return res.status(400).json({
      error: 'require "content" flied is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  newNote.save().then((savedNote) => {
    res.json(savedNote)
  })
})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
