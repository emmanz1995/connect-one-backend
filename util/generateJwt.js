const jwt = require('jsonwebtoken')

const generateJwt = (userInfo) => {
    return jwt.sign(userInfo, process.env.SECRET_KEY, { expiresIn: '365d' })
}

module.exports = generateJwt