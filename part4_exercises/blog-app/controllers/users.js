const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
 

usersRouter.get('/', async (request, respnse) => {
    const users = await User.find({})
    respnse.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

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

