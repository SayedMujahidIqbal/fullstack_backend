const logger = require('./logger')

const unknwonEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if(error.name = 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name = 'ValidatorError'){
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    unknwonEndPoint,
    errorHandler
}