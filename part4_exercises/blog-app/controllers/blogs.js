const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('creator', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1})
    if(blog){
        response.json(blog)
    }else{
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if(!decodedToken.id){
            return response.status(401).send('Token invalid')
        }

    const user = await User.findById(decodedToken.id)

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
})

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
        return response.status(401).send('Token invalid')
    }

    const blogTobeDeleted = await Blog.findById(request.params.id)

    if(decodedToken.id !== blogTobeDeleted.creator.toString()){
        response.status(400).json({ error: 'Blog deletion failed' }) 
    } else {
        await Blog.findByIdAndDelete(request.params.id)
        const user = await User.findById(decodedToken.id)
        user.blogs = user.blogs.filter(blog => blog._id.toString() !== request.params.id)
        await user.save()
        response.status(204).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query'})
    response.status(200).json(updatedBlog)
})


module.exports = blogsRouter