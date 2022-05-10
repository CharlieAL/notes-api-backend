const mongoose = require('mongoose')

const { MONGO_DB_URL, MONGO_DB_URL_TEST, NODE_ENV } = process.env

const connectionUri = NODE_ENV === 'test' ? MONGO_DB_URL_TEST : MONGO_DB_URL
console.log(connectionUri)

// conexion a mongoose

mongoose
  .connect(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => {
    console.log('connect success db')
  })
  .catch((err) => console.log(err))
