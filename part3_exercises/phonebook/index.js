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


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person.find(req.params.id).then(person => {
    res.json(person)
  })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number){
      return res.status(400).json({
        error: 'content missing'
      })
    } 
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
})

app.get('/info', (req, res) => {
    const numberOfInfosInPhonebook = persons.length
    const options = { 
        weekday: 'long', 
        month: 'long', 
        year: 'numeric',  
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    }
    res.send(`<p>Phonebook has info for ${numberOfInfosInPhonebook} people</p><p>${new Date().toLocaleDateString('en-US', options)} ${new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
   console.log(`Server is running at http://localhost:${PORT}`) 
})