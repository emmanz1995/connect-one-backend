const LoginRoute = require('express').Router()
const User = require('../model/userModel')
const BadRequestError = require('../errors/badRequest')
const bcrypt = require('bcryptjs')
const { StatusCodes } = require('http-status-codes')
const generateJwt = require('../util/generateJwt')

LoginRoute.post('/', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const checkUser = user === null ?
        false : await bcrypt.compare(password, user.password)
    if(!(user && checkUser)) {
        throw new BadRequestError('Invalid credentials!')
    }
    const userInfo = {
        id: user.id,
        email: user.email,
    }
    const token = generateJwt(userInfo)
    res.status(StatusCodes.OK).json({ token, id: userInfo.id })
})


module.exports = LoginRoute