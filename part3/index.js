require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const Phonebook = require('./models/phonebook');

const app = express();

// Middleware
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



// Endpoints
const genereateId = () => {
    return String(Math.floor(Math.random() * 1000000 + 1));
}

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/info', (request, response) => {
    const currentDate = new Date().toString();
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentDate}</p>
    `);
});

app.get('/api/persons/:id', (request, response) => {
    Phonebook.findById(request.params.id).then(phonebook => {
        response.json(phonebook);
    });
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    }
    
    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    }

    if(persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: genereateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person);

    return response.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});