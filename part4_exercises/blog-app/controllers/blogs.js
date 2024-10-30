const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('creator', {username: 1, name: 1})
    response.json(blogs)
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
    if(request.user){
        const user = await User.findById(request.user._id)
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            creator: user.id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    } else {
        response.status(401).send('invalid token')
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const blogTobeDeleted = await Blog.findById(request.params.id)
    if(request.user){
        const user = request.user
        if(user._id.toString() !== blogTobeDeleted.creator.toString()){
            response.status(400).json({ error: 'Request not authorized' }) 
        } else {
            await Blog.findByIdAndDelete(request.params.id)
            const userWithUpdatedBlogs = await User.findById(user._id)
            userWithUpdatedBlogs.blogs = userWithUpdatedBlogs.blogs.filter(blog => blog._id.toString() !== request.params.id)
            await userWithUpdatedBlogs.save()
            response.status(204).end()
        }
    } else {
        response.status(401).send('invalid token')
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query'})
    response.status(200).json(updatedBlog)
})


module.exports = blogsRouter