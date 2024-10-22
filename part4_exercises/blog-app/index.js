require('dotenv').config()
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, (req, res) => {
    logger.info(`Server is running at http://localhost:${config.PORT}`)
})