const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, responseponse) => {
    const blogs = await Blog.find({})
    responseponse.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if(blog){
        response.json(blog)
    }else{
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query'})
    response.status(200).json(updatedBlog)
})


module.exports = blogsRouter