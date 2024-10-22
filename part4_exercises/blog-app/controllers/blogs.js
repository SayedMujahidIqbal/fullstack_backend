const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')


blogsRouter.get('/', (req, res, next) => {
    Blog.find({}).then(blogs => {
        res.json(blogs)
    }).catch(error => next(error))
})

blogsRouter.get('/api/blogs/:id', (req, res, next) => {
    Blog.findById(req.params.id).then(blog => {
        if(blog){
            res.json(note)
        }else{
            res.status(404).end()
        }
    })
    Blog.find({}).then(blogs => {
        res.json(blogs)
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