const jwt = require('jsonwebtoken')

const generateJwt = (userInfo) => {
    return jwt.sign(userInfo, process.env.SECRET_KEY, { expiresIn: 3600 })
}

module.exports = generateJwt