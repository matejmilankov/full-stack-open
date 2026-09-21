const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');

const blogRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

const middleware = require('./utils/middleware');

const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('connceted to MongoDB');
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message);
    });


app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app