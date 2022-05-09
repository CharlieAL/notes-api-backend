const { model, Schema } = require('mongoose')

const noteSchema = new Schema({
  content: String,
  date: { type: Date },
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id
    delete returnObject._id
    delete returnObject.__v
  }
})

const Note = model('Note', noteSchema)

module.exports = Note
