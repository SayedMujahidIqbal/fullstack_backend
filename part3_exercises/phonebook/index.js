const express = require('express')
const app = express()

app.use(express.json())

const persons = [
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

app.get('/api/persons', (req, res) => {
    res.json(persons)
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