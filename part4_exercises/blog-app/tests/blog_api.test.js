const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)


describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned in json format' ,async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned' ,async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
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

    test('a specific blog is within the returned blog', async () => {
        const response = await api.get('/api/blogs')
    
        const titles = response.body.map(r => r.title)
        assert(titles.includes('Go To Statement Considered Harmful'))
    })

    describe('viewing a specific blog', () => {
        test('succeeds with valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
            
            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, blogToView)
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNoneexistingId = await helper.nonExistingId()
    
            await api
                .get(`/api/blogs/${validNoneexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'
    
            await api
                .get(`/api/blogs/${invalidId}`)
                .expect(400)
        })
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const newBlog = {
                title: 'my blog',
                author: 'Mujahid',
                url: 'https://mujiBlogs.com/myblog.html',
                likes: 4
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
                const blogsAtEnd = await helper.blogsInDb()
                assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

                const titles = blogsAtEnd.map(b => b.title)
                assert(titles.includes('my blog'))
        })

        test('like property set to zero if missing in request body', async () => {
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

        test('fails with statuscode 400 if blog without title, url or author cannot be added', async () => {
            const newBlog = {
                author: "Mujahid",
            }
            await api
                .post(`/api/blogs`)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    }) 
    
    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api   
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

            const titles = blogsAtEnd.map(b => b.title)
            assert(!titles.includes(blogToDelete.title))
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})