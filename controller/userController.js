const {StatusCodes} = require('http-status-codes')
const BadRequest = require('../errors/badRequest')
const UserRoute = require('express').Router()
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const requireLogin = require('../middleware/requireLogin')

UserRoute.post('/', async (req, res) => {
    const { name, username, email, dob, password } = req.body
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
        dob,
        password: hashedPassword
    })
    const savedUser = await registerUser.save()
    res.status(StatusCodes.CREATED).json(savedUser)
})

UserRoute.get('/', requireLogin, async (req, res) => {
    const getProfile = await User.findById(req.user.id).populate('post').select('-password -__v')
    res.status(StatusCodes.OK).json(getProfile)
})

module.exports = UserRoute
