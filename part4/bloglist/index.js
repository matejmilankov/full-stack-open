const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')

const app = express()



const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())
app.use('/api/blogs', blogRouter)




app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})