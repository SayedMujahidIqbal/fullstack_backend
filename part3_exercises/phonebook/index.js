const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())

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

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(n => Number(n.id)))
  : 0
  return String(maxId + 1)
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const personId = req.params.id
  const person = persons.find(person => person.id === personId)
  if(person){
    res.json(person)
  }else{
    res.status(404).end()
}
})

app.delete('/api/persons/:id', (req, res) => {
  const personId = req.params.id
  persons = persons.filter(person => person.id !== personId)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name || !body.number){
    return res.status(400).json({
      error: 'content missing'
    })
  } 
  const alreadyExist = persons.find(person => person.name === body.name)
  if(alreadyExist){
    return res.status(400).json({
      error: 'name must be unique'
    })
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
    res.status(200).json(person)
  }
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

const PORT = 3001
app.listen(PORT, () => {
   console.log(`Server is running at http://localhost:${PORT}`) 
})