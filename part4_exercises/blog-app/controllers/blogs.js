const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')


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

blogsRouter.post('/', (req, res, next) => {
    const body = req.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    blog.save().then(savedBlog => {
        res.status(201).json(savedBlog)
    }).catch(error => next(error))
})


module.exports = blogsRouter