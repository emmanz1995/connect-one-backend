const Post = require('../model/postModel')
const PostRoute = require('express').Router()
const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/badRequest')
const requireLogin = require('../middleware/requireLogin')
const Filter = require('bad-words')

PostRoute.post('/', requireLogin, async(req, res) => {
    const { content, image } = req.body
    const { user } = req
    if(!content) {
        throw new BadRequestError('You didnt add any content!')
    }
    const filter = new Filter()
    const badLanguage = filter.isProfane(content)

    if(badLanguage) {
        throw new BadRequestError('You can not you those filthy words on this platform, sorry!')
    }
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
    const getPosts = await Post.find().populate('postedBy', 'username avatar')
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
    if(req?.user?._id?.toString() === post?.postedBy?._id?.toString()) {
        await Post.findByIdAndDelete(post)
        res.status(StatusCodes.NO_CONTENT).end()
    } else {
        throw new BadRequestError('Something went wrong!')
    }
})

PostRoute.put('/like/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    const userId = req.user.id
    const post = await Post.findById(postId)
    const isLiked = post.likes.filter((like) => like.toString() === userId)
    if(isLiked.length > 0) {
        throw new BadRequestError('You liked this post already!')
    }
    const like = await Post.findByIdAndUpdate(postId, {
        $push: {
            likes: userId
        }
    }, {
        new: true
    })
    res.status(StatusCodes.OK).json(like)
})

PostRoute.put('/dislike/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    const userId = req.user.id
    // const dislike = await Post.find({ id: postId, likes: userId })
    const post = await Post.findById(postId)
    const isDisliked = post.likes.filter((like) => like.toString() === userId)
    if(isDisliked.length < 0) {
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

PostRoute.put('/comment/:postId', requireLogin, async (req, res) => {
    const { postId } = req.params
    const userId = req.user.id
    const comment = {
        comment: req.body.comment,
        postedBy: userId
    }
    await Post.findByIdAndUpdate(postId, {
        $push: {
            comments: comment
        }
    }, {
        new: true
    })
    if(!postId) {
        throw new BadRequestError('Post does not exist!')
    }
    res.status(StatusCodes.NO_CONTENT).end()
})
module.exports = PostRoute