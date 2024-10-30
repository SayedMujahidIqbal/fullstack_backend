const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const unknwonEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    } else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error collection')){
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({ error: 'token invalid' })
    }
    
    next(error)
}

const tokenExtractor = (request, response, next) => {
    if(request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer'){
        request.token = request.headers.authorization.split(' ')[1]    
    }
    next()
}

const userExtractor = async (request, response, next) =>{
    if(request.token){
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        request.user = user 
    }
    next()
}

module.exports = {
    unknwonEndPoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}