const { Post } = require('../../mongo/posts/postModel')
const PostRoute = require('express').Router()
const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../../../errors/badRequest')
// const NotFound = require('../errors/notFound')
const requireLogin = require('../../../middleware/requireLogin')
const Filter = require('bad-words')
const User = require('../../mongo/users/userModel')
const cloudinary = require('cloudinary').v2
const { SavePost, FetchPosts, FetchPostById, FetchMyPosts } = require('../../mongo/posts/postModel')

PostRoute.post('/', requireLogin, async (req, res) => {
  const { content, image } = req.body
  const { user } = req
  if (!content)
    throw new BadRequestError('You didnt add any content!')

  const filter = new Filter()
  const badLanguage = filter.isProfane(content)

  if (badLanguage)
    throw new BadRequestError(
      'You can not you those filthy words on this platform, sorry!'
    )

  const cloud = await cloudinary.uploader.upload(image, { folder: 'post-images' })
  const post = {
    content,
    image: {
      publicId: cloud?.public_id,
      url: cloud?.secure_url,
    },
    postedBy: user,
  }

  const savedPost = await SavePost(post)
  user.post = user && user.post.concat(savedPost)
  await user.save()
  res.status(StatusCodes.CREATED).json(savedPost)
})

PostRoute.get('/', async (req, res) => {
  const getPosts = await FetchPosts()
  res.status(StatusCodes.OK).json(getPosts)
})

PostRoute.get('/getMyPosts', requireLogin, async (req, res) => {
  const posts = await FetchMyPosts(req.user)
  res.status(StatusCodes.OK).json(posts)
})

PostRoute.get('/getposts', requireLogin, async (req, res) => {
  const user = await User.findById(req.user.id)
  const posts = await Post.find({
    postedBy: {
      $in: user.following,
    },
  }).populate('postedBy')
  res.status(StatusCodes.OK).json(posts)
})

PostRoute.get('/:postId', async (req, res) => {
  const { postId } = req.params
  const getPost = await FetchPostById(postId);
  res.status(StatusCodes.OK).json(getPost)
})

PostRoute.delete('/:postId', requireLogin, async (req, res) => {
  const { postId } = req.params
  const post = await Post.findById(postId)
  if (req?.user?._id?.toString() === post?.postedBy?._id?.toString()) {
    const deletePost = await Post.findByIdAndDelete(post)

    await cloudinary.uploader.destroy(post.image.publicId)

    const user = await User.findById(req.user.id)

    const item = user.post.indexOf(postId)
    user.post.splice(item, 1)

    await user.save()

    res.status(StatusCodes.OK).json(deletePost)
  } else {
    throw new BadRequestError('Something went wrong!')
  }
})

PostRoute.put('/like/:postId', requireLogin, async (req, res) => {
  const { postId } = req.params
  const userId = req.user.id
  let post = await Post.findById(postId)
  const isLiked = post.likes.filter((like) => like.toString() === userId)
  if (isLiked.length > 0)
    throw new BadRequestError('You liked this post already!')

  const like = await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        likes: userId,
      },
    },
    { new: true }
  ).populate('postedBy')
  res.status(StatusCodes.OK).json(like)
})

PostRoute.put('/dislike/:postId', requireLogin, async (req, res) => {
  const { postId } = req.params
  const userId = req.user.id
  const post = await Post.findById(postId)
  const isDisliked = post.likes.filter((like) => like.toString() === userId)
  if (isDisliked.length < 0)
    throw new BadRequestError(
      'I know you hate this post but you can only dislike once, sorry sad face ☹️'
    )

  const dislikedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $pull: {
        likes: userId,
      },
    },
    { new: true }
  ).populate('postedBy')
  res.status(StatusCodes.OK).json(dislikedPost)
})

PostRoute.put('/comment/:postId', requireLogin, async (req, res) => {
  const { postId } = req.params
  const userId = req.user.id
  const comment = {
    comment: req.body.comment,
    postedBy: userId,
  }
  const commentOnPost = await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: comment,
      },
    },
    {
      new: true,
    }
  )
  if (!postId)
    throw new BadRequestError('Post does not exist!')

  res.status(StatusCodes.OK).json(commentOnPost)
})

module.exports = PostRoute
