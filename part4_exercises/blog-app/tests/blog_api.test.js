const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs are returned in json format' ,async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('unique identifier _id of a blog is named as id', async () => {
    Blog.schema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })
    const result = await api
        .get(`/api/blogs`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    result.body.forEach(blog => {
        assert.ok(blog.id, true)
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Proztec A diary",
        author: "Mujahid",
        url: "ttp://www.u.arizona.edu/~rubinson/copyright_violations/proztec_Harmful.html",
        likes: 6
    }
    await api
        .post(`/api/blogs`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Proztec A diary'))
})

test.only('like property set to zero if missing in request body', async () => {
    const newBlog = {
        title: "Like test",
        author: "Mujahid",
        url: "ttp://www.u.arizona.edu/~rubinson/copyright_violations/like_Harmful.html"
    }
    await api
        .post(`/api/blogs`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Like test'))
})

after(async () => {
    await mongoose.connection.close()
})