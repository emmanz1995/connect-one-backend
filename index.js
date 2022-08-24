const http = require('http')
const PORT = 3002
const app = require('./app')
const cloudinary = require('cloudinary').v2
const { CLOUD_NAME ,API_KEY, API_SECRET } = require('./util/config')

const server = http.createServer(app)

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
})

server.listen(PORT, () => {
    console.log(`Listening on PORT: ${ PORT }`)
})
