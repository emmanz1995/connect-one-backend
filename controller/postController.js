const Post = require('../model/postModel')
const PostRoute = require('express').Router()
const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/badRequest')
const requireLogin = require('../middleware/requireLogin')

PostRoute.post('/', requireLogin, async(req, res) => {
    const { content, image } = req.body
    const { user } = req
    if(!content) {
        throw new BadRequestError('You didnt add any content!')
    }
    console.log(req.user)
    const post = new Post({
        content,
        image,
        postedBy: user.id
    })
    const savedPost = await post.save()
    user.post = user.post.concat(savedPost)
    await user.save()
    res.status(StatusCodes.CREATED).json(savedPost)
})

PostRoute.get('/', async (req, res) => {
    const getPosts = await Post.find()
    res.status(StatusCodes.OK).json(getPosts)
})

PostRoute.get('/:postId', async (req, res) => {
    const { postId } = req.params
    const getPost = await Post.findById(postId)
    res.status(StatusCodes.OK).json(getPost)
})

PostRoute.delete('/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    const post = await Post.findById(postId)
    if(req?.user?._id?.toString() === post?.user?._id?.toString()) {
        await Post.findByIdAndDelete(postId)
        res.status(StatusCodes.NO_CONTENT).end()
    }
})

PostRoute.put('/like/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    const userId = req.user.id
    const likedPost = await Post.find({ id: postId, likes: userId })
    if(likedPost.length > 0) {
        throw new BadRequestError('You liked this post already!')
    }
    await Post.findByIdAndUpdate(postId, {
        $push: {
            likes: userId
        }
    }, {
        new: true
    })
    res.status(StatusCodes.NO_CONTENT).end()
})

PostRoute.put('/dislike/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    const userId = req.user.id
    const dislike = await Post.find({ id: postId, likes: userId })
    if(dislike.length < 0) {
        throw new BadRequestError('I know you hate this post but you can only dislike once, sorry sad face ☹️')
    }
    await Post.findByIdAndUpdate(postId, {
            $pull: {
                likes: userId
            }
        }, {
            new: true
        })
    res.status(StatusCodes.NO_CONTENT).end()
})
module.exports = PostRoute