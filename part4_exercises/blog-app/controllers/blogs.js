const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/api/blogs/:id', (request, response) => {
    Blog.findById(request.params.id).then(blog => {
        if(blog){
            response.json(note)
        }else{
            response.status(404).end()
        }
    })
    Blog.find({}).then(blogs => {
        response.json(blogs)
    }).catch(error => next(error))
})

blogsRouter.post('/', async (req, res, next) => {
    const body = req.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})


module.exports = blogsRouter