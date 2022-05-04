const {StatusCodes} = require('http-status-codes')
const BadRequest = require('../errors/badRequest')
const UserRoute = require('express').Router()
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const requireLogin = require('../middleware/requireLogin')
const Filter = require('bad-words')
const gravatar = require('gravatar')

UserRoute.post('/', async (req, res) => {
    const { name, username, email, dob, password } = req.body
    if(!name || !username || !email || !password) throw new BadRequest('Please add all the fields!')
    const user = await User.findOne({ email })
    let filter = new Filter()
    const badName = filter.isProfane(name.toLowerCase())
    const badUsername = filter.isProfane(username.toLowerCase())

    if(badName) {
        throw new BadRequest('Pick a proper name and not that filth!')
    } else if(badUsername) {
        throw new BadRequest('Pick a proper username and not that filth!')
    }

    if(user) {
        throw new BadRequest('User email already exists!')
    }
    const avatar = gravatar.url(email, {
        s: '200', r: 'pg', d: '404'
    });
    const hashedPassword = await bcrypt.hash(password, 10)
    const registerUser = new User({
        name,
        username,
        email,
        avatar,
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
