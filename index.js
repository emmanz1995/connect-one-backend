const http = require('http')
const app = require('./app')
const cloudinary = require('cloudinary').v2
const { CLOUD_NAME, API_KEY, API_SECRET } = require('./src/util/config')

const PORT = 3002

const server = http.createServer(app)

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
})

server.listen(PORT, () =>
  console.log(`Listening on PORT: ${PORT}`)
)
