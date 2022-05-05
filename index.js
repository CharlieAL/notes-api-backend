const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')
// notes
app.use(express.json())

app.use(logger)

app.use(cors())

let notes = [
  {
    id: 1,
    content: 'palabras que show',
    date: '2022-05-19T18:30:00.09123',
    important: true
  },
  {
    id: 2,
    content: 'palabras que royal',
    date: '2022-10-12T18:10:00.09123',
    important: true
  },
  {
    id: 3,
    content: 'palabras algo bien miapa',
    date: '2022-09-29T18:20:00.09123',
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id)
  console.log(id)
  const note = notes.find((note) => note.id === id)
  if (note) {
    console.log('Bien')
    res.json(note)
  } else {
    console.log('no')
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = notes.concat(newNote)
  res.json(newNote)
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
