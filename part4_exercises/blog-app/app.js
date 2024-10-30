const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(result => {
    logger.info('connected to DB')
})
.catch(error => {
    logger.error('error connecting to MongoDB', error)
})


app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use(middleware.unknwonEndPoint)
app.use(middleware.errorHandler)

module.exports = app