const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when there is initially one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const user = new User({ username: 'root' })
        await user.save() 
    })
    test('succeeds with fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "sadik",
            name: "Asad",
            password: "sadika"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "super"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if user is invalid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "",
            name: "Superuser",
            password: "sasd"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.matchAll(['`Password` must be atleast 3 characters long', '`Username` should be atleast 3 characters long']))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
