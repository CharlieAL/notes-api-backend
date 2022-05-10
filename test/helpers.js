const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)

const initialNotes = [
  {
    content: 'hola como estas',
    important: true,
    date: new Date()
  },
  {
    content: 'hello how are you',
    important: false,
    date: new Date()
  },
  {
    content: 'que onda como vas?',
    important: true,
    date: new Date()
  }
]

const getAllNotesContent = async () => {
  const res = await api.get('/api/notes')
  return {
    contents: res.body.map((note) => note.content),
    res
  }
}

module.exports = {
  initialNotes,
  api,
  getAllNotesContent
}
