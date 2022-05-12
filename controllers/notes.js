const noteRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

noteRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(notes)
})

noteRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => next(err))
})

noteRouter.put('/:id', userExtractor, (req, res, next) => {
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

noteRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  try {
    await Note.findByIdAndRemove(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

noteRouter.post('/', userExtractor, async (req, res, next) => {
  try {
    const { content, important = false } = req.body
    const { userId } = req
    const user = await User.findById(userId)

    if (!content) {
      return res.status(400).json({
        error: 'require "content" flied is missing'
      })
    }

    const newNote = new Note({
      content,
      date: new Date(),
      important,
      user: user._id
    })

    // newNote.save().then((savedNote) => {
    //   res.json(savedNote)
    // }).catch((err) => next(err))

    const saveNote = await newNote.save()

    user.notes = user.notes.concat(saveNote._id)
    await user.save()
    res.json(saveNote)
  } catch (error) {
    next(error)
  }
})

module.exports = noteRouter
