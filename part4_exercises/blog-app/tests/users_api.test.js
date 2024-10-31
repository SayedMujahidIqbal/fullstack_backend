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
    describe('when user register', () => {
        test('succeeds with fresh username', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const newUser = {
                username: "muji",
                name: "mujahid",
                password: "mypass"
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
                username: "saju",
                name: "Superuser",
                password: "s"
            }
    
            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            
            const usersAtEnd = await helper.usersInDb()
            if(result.body.errors){
                assert(result.body.errors.includes('`Password` must be atleast 3 characters long'))
            } else {
                assert(result.body.error.includes('`Username` must be atleast 3 characters long'))
            }
    
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
    })
    describe('when user try to login', () =>{
        test('when user loggedin', async () => {
            const newUser = {
                username: "superuser",
                name: "Mujahid",
                password: "mypass"
            }
    
            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)   

            const userToLogin = {
                username: 'superuser',
                password: 'mypass'
            }

            const result = await api
                        .post('/api/login')
                        .send(userToLogin)
                        .expect('Content-Type', /application\/json/)
            
            assert.strictEqual(result.body.username, userToLogin.username)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
