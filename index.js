const http = require('http')
const PORT = 3002
const app = require('./app')

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})
