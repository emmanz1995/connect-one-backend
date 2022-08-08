const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const userController = require('./controller/userController')
const authController = require('./controller/authController')
const postController = require('./controller/postController')
const prayerController = require('./controller/prayerController')
const ErrorHandler = require('./middleware/ErrorHandler')
const mongoose = require('mongoose')
require('dotenv').config()

const MONGODBURI = process.env.MONGODB_URI

app.get('/', (req, res) => {
    res.status(200).send('<h1>Welcome to Connect One social media App!</h1>')
})

mongoose.connect(MONGODBURI)
    .then(() => {
        console.log('MongoDB connection Successful!')
    })
    .catch(err => {
        console.log(err)
    })

app.use(express.json())

app.use('/api/user', userController)
app.use('/api/auth', authController)
app.use('/api/post', postController)
app.use('/api/prayer', prayerController)
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(ErrorHandler)

module.exports = app


