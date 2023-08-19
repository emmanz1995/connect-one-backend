const mongoose = require('mongoose')
require('dotenv').config()
const MONGODBURI = process.env.MONGODB_URI

const connectDB = () => {
  mongoose.connect(MONGODBURI).then(() => {
    console.log('MongoDB connection Successful!')
  }).catch(err => {
    console.log(err)
  })
}

module.exports = { connectDB }