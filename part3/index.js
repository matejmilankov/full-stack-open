require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const Phonebook = require('./models/phonebook');
const phonebook = require('./models/phonebook');

const app = express();

// Middleware
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



// Endpoints

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

app.get('/api/persons/:id', (request, response, next) => {
    Phonebook.findById(request.params.id)
        .then(phonebook => {
            if (phonebook)
                response.json(phonebook);
            else
                response.status(404).end();
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
    phonebook.deleteOne({ id: request.params.id })
        .then(result => {
            response.status(204).end();
        })
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    }

    const person = new Phonebook({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
}
app.use(unknownEndpoint);

const errorHandler = (error, request, responose, next) => {
    if(error.name === 'CastError')
        return responose.status(400).send({ error: "malformatted id" });

    next(error);
}
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});