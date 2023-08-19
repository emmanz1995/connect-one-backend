const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const userController = require('./src/api/user/user.router')
const authController = require('./src/api/auth/auth.router')
const postController = require('./src/api/post/post.router')
const ErrorHandler = require('./middleware/ErrorHandler')
const { connectDB } = require('./src/mongo/connectDB')
require('dotenv').config()

app.get('/', (req, res) =>
  res.status(200).send('<h1>Welcome to Connect One social media App!</h1>')
)

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userController)
app.use('/api/auth', authController)
app.use('/api/post', postController)

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(ErrorHandler)

module.exports = app
