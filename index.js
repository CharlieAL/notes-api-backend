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

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
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

app.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    await Note.findByIdAndRemove(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/notes', async (req, res, next) => {
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

  // newNote.save().then((savedNote) => {
  //   res.json(savedNote)
  // }).catch((err) => next(err))

  try {
    const saveNote = await newNote.save()
    res.json(saveNote)
  } catch (error) {
    next(error)
  }
})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})

module.exports = { app, server }
