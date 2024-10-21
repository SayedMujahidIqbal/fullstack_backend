require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person.js')
const morgan = require('morgan')


mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


/////// Morgan middlewares logs request method, url , status and response length and response time
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

////////////// Creating Token to return request body //////////////////
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :body'))


app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    if(persons){
      res.json(persons)
    }else{
      res.status(204).end()
    }
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findOne({ _id: req.params.id }).then(person => {
    if(person){
      res.json(person)
    }else{
      res.status(204).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(deletedPerson => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' }).then(updatedPerson => {
    res.json(updatedPerson)
  }).catch(error => next(error))
})

app.get('/info', async (req, res) => {
  const options = {
    weekday: 'long',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }
  res.send(`<p>Phonebook has info for ${await Person.countDocuments({})} people</p><p>${new Date().toLocaleDateString('en-US', options)} ${new Date().toString().match(/([A-Z]+[+-][0-9]+.*)/)[1]}</p>`)
})

const unKnownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unKnownEndPoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})