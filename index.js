require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(express.static('build'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send("Puhelinluettelossa on " + persons.length + " henkilön tiedot. "
            + new Date())
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person.toJSON())
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
});
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(savedPerson => {
            response.json(savedPerson.toJSON())
        })

    /*if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: `name or number is missing`
        })
    }


    const vanha = numerot.find(henkilo => body.name === henkilo.name)

    console.log('vanha', vanha)
    if (vanha) {
        return response.status(400).json({
            error: `name must be unique`
        })
    }

    const tiedot = {
        name: body.name,
        number: body.number,
        id: getRandomInt(9999999),
    }

    numerot = numerot.concat(tiedot)

    response.json(tiedot)*/
})

const port = process.env.PORT
app.listen(port)
console.log(`Server running on port ${port}`)