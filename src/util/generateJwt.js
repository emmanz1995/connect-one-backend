const jwt = require('jsonwebtoken')

const generateJwt = userInfo =>
  jwt.sign(userInfo, process.env.SECRET_KEY, { expiresIn: '365d' })

module.exports = generateJwt
