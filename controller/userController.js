const { StatusCodes } = require('http-status-codes')
const BadRequest = require('../errors/badRequest')
const UserRoute = require('express').Router()
const User = require('../model/userModel')
const Post = require('../model/postModel')
const requireLogin = require('../middleware/requireLogin')
const Filter = require('bad-words')
const cloudinary = require('cloudinary').v2

UserRoute.post('/', async (req, res) => {
    const { name, username, email, dob, avatar, password } = req.body
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

    const cloud = await cloudinary.uploader.upload(avatar, { folder: 'avatars' })

    const registerUser = new User({
        name,
        username,
        email,
        avatar: { publicId: cloud?.public_id, url: cloud?.secure_url },
        dob,
        password
    })
    const savedUser = await registerUser.save()
    res.status(StatusCodes.CREATED).json(savedUser)
})

UserRoute.get('/', requireLogin, async (req, res) => {
    const getProfile = await User.findById(req.user.id).populate('post').select('-password -__v').populate('bookmarks')
    res.status(StatusCodes.OK).json(getProfile)
})

UserRoute.get('/all', requireLogin, async (req, res) => {
    const getUsers = await User.find({}).populate('post')
    res.status(StatusCodes.OK).json(getUsers)
})

UserRoute.put('/bookmark/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    const post = await Post.findById(postId)
    if(!post) {
        throw new BadRequest('Post was not found!')
    }
    if(post.length > 0) {
        throw new BadRequest('You already bookmarked this Post!')
    }
    const bookmarkPost = await User.findByIdAndUpdate(req.user.id, {
        $push: {
            bookmarks: post
        }
    }, {
        new: true
    })
    res.status(StatusCodes.OK).json(bookmarkPost)
})

UserRoute.put('/unbookmark/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    const post = await Post.findById(postId)
    if(!post) {
        throw new BadRequest('Post was not found!')
    }

    if(post.length < 0) {
        throw new BadRequest('Post was already removed from Bookmarks!')
    }
    const unbookmarkPost = await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            bookmarks: post
        }
    }, {
        new: true
    })
    res.status(StatusCodes.OK).json(unbookmarkPost)
})

UserRoute.put('/follow/:id', requireLogin, async(req, res) => {
    const userId = req.params.id
    if(!userId) {
        throw new BadRequest('Could not find user!')
    }
    const user = await User.findById(req.user.id)

    if(user.following.includes(userId)) {
        throw new BadRequest('You are already following this user!')
    }
    const followUser = await User.findByIdAndUpdate(req.user.id, {
        $push: { following: userId }
    })
    await User.findByIdAndUpdate(userId, {
        $push: { follower: req.user.id }
    })
    res.status(StatusCodes.OK).json(followUser)
})

UserRoute.put('/unfollow/:id', requireLogin, async(req, res) => {
    const userId = req.params.id
    if(!userId) {
        throw new BadRequest('Could not find user!')
    }
    const user = await User.findById(req.user.id)
    if(!user.following.includes(userId)) {
        throw new BadRequest('You have already unfollowed this user!')
    }
    const followUser = await User.findByIdAndUpdate(req.user.id, {
        $pull: { following: userId }
    })
    await User.findByIdAndUpdate(userId, {
        $pull: { follower: req.user.id }
    })
    res.status(StatusCodes.OK).json(followUser)
})

module.exports = UserRoute
