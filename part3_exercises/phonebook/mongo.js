const mongoose = require('mongoose')

if(!process.argv.length){
    console.log('give password, person name, number as arguments')
    process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.g9sia.mongodb.net/phonebookdb`

mongoose.set('strictQuery', false)

mongoose.connect(url)
const personSchema = mongoose.Schema({
    name: String,
    number: String
})    
const Person = mongoose.model('Person', personSchema)

if(password && personName && number){

    const person = new Person({
        name: personName,
        number: number
    })

    person.save().then(result => {
        console.log('person saved')
        mongoose.connection.close()
    })
}else if(password){
    Person.find({}).then(result => {
        console.log("Phonebook: ")
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}