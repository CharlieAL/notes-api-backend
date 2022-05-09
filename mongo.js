const mongoose = require('mongoose')

const connectionUrl = process.env.MONGO_DB_URL

// conexion a mongoose

mongoose
  .connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connect success db')
  }).catch(err => console.log(err))
