const {StatusCodes} = require('http-status-codes')

const BadRequest = require('../errors/badRequest')
const UserRoute = require('express').Router()
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')

UserRoute.post('/', async (req, res) => {
    const { name, username, email, password } = req.body
    if(!name || !username || !email || !password) throw new BadRequest('Please add all the fields!')
    const user = await User.findOne({ email })
    if(user) {
        throw new BadRequest('User email already exists!')
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const registerUser = new User({
        name,
        username,
        email,
        password: hashedPassword
    })
    const savedUser = await registerUser.save()
    res.status(StatusCodes.CREATED).json(savedUser)
})

module.exports = UserRoute
