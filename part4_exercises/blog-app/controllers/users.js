const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const { body, validationResult} = require('express-validator')
const User = require('../models/user')
 

usersRouter.get('/', async (request, respnse) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, likes:1 })
    respnse.json(users)
})

usersRouter.post('/', [
    body('password', '`Password` must be atleast 3 characters long').isLength({ min: 3 })
], async (request, response) => {
    const { username, name, password } = request.body

    const errors = validationResult(request)

    if(!errors.isEmpty()){
        return response.status(400).json({ error: errors.array().map(e => e.msg) })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    const user = new User({
        username:username,
        name: name,
        passwordHash: hashedPassword
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter

