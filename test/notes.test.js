const { default: mongoose } = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')

const { initialNotes, api, getAllNotesContent } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  // parrallel
  const notesObject = initialNotes.map((note) => new Note(note))
  const promises = notesObject.map((note) => note.save())
  await Promise.all(promises)

  // sequential
  // for (const note of initialNotes) {
  //   const newObject = new Note(note)
  //   await newObject.save()
  // }
})

describe('Get Notes', () => {
  test('notes are returned as JSON', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('content-type', /application\/json/)
  })

  test('there are notes', async () => {
    const res = await api.get('/api/notes')
    console.log(res.body)
    expect(res.body).toHaveLength(initialNotes.length)
  })

  test('frist note is about the hi', async () => {
    const { contents } = await getAllNotesContent()
    expect(contents).toContain('hola como estas')
  })
})

describe('create notes', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'test add note',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('content-type', /application\/json/)

    const { res, contents } = await getAllNotesContent()
    expect(res.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('note without content', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
      .expect('content-type', /application\/json/)

    const { res } = await getAllNotesContent()
    expect(res.body).toHaveLength(initialNotes.length)
  })
})

describe('delete notes', () => {
  test('note can be delete', async () => {
    const { res: fristResponse } = await getAllNotesContent()
    const { body: notes } = fristResponse
    const noteToDelete = notes[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)
    const { contents, res: secondResponse } = await getAllNotesContent()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
  })
  test('a note do not exist can be deleted', async () => {
    await api.delete('/api/notes/123123').expect(400)
    const { res } = await getAllNotesContent()

    expect(res.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
