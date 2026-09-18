const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const blogRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');

const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 });

app.use(express.json());

app.use('/api/blogs', blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});