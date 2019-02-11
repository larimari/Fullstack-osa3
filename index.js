const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(express.static('build'))


let numerot = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '045-1234567',
    },
    {
        id: 2,
        name: 'Maria Larionova',
        number: '045-6333450',
    },
    {
        id: 3,
        name: 'Olga Viholainen',
        number: '050-9876543',
    },
    {
        id: 4,
        name: 'Ope Opettaja',
        number: '040-4589129',
    },
]
console.log(numerot.length)

app.get('/api/persons', (request, response) => {
    response.json(numerot)
})

app.get('/info', (request, response) => {
    console.log(numerot.length)
    response.send("Puhelinluettelossa on " + numerot.length + " henkilön tiedot. "
        + new Date())
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const nimi = numerot.find(nimi => nimi.id === id)
    if (nimi) {
        response.json(nimi)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    numerot = numerot.filter(nimi => nimi.id !== id);

    response.status(204).end();
});
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if(body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: `name or number is missing`
        })
    } 
    
    const vanha = numerot.find(henkilo => body.name === henkilo.name)

    console.log('vanha',vanha)
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

    response.json(tiedot)
})

const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)