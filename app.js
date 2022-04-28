const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const userController = require('./controller/userController')
const ErrorHandler = require('./middleware/ErrorHandler')
const mongoose = require('mongoose')
require('dotenv').config()

const MONGODBURI = process.env.MONGODB_URI

app.get('/', (res, req) => {
    res.status(200).send('<h1>Welcome to the Connect One social media App!</h1>')
})

mongoose.connect(MONGODBURI, {
    useNewUrlParser: true, useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connection Successful!')
    })
    .catch(err => {
        console.log(err)
    })

app.use(express.json())

app.use('/api/user', userController)
const corsOptions = { origin: '*' }

app.use(cors(corsOptions))
app.use(ErrorHandler)

module.exports = app


