const { default: mongoose } = require('mongoose')

const { server } = require('../index')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getUsers } = require('./helpers')

describe.only('create user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'carlitos', passwordHash })
    await user.save()
  })

  test('works as expected creating a fresh user', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
      username: 'pancho',
      name: 'test user by me',
      password: 'bottle'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('content-type', /application\/json/)

    const userAtEnd = await getUsers()
    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = await userAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'carlitos',
      name: 'john',
      password: '123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('content-type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fail because username is null or undefined', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
      name: 'test user by me',
      password: 'bottle'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('content-type', /application\/json/)

    expect(result.body.errors.username.message).toContain('Path `username` is required.')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })
})
