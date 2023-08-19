const getPosts = Model => async () => {
  const posts = await Model.find({})

  if(posts === null) return []

  return posts
}

const getPostById = Model => async id => {
  const post = await Model.findById(id)
    .populate('postedBy', 'username avatar')
    .populate('comments.postedBy', 'username')
    .sort('-likes')

  if(post === null) return {}

  return post
}

const getMyPosts = Model => async user => {
  const myPosts = await Model.find({ postedBy: user })
    .sort('-createdAt')
    .populate('postedBy')

  if(myPosts === null) return []

  return myPosts
}

const getMyFollowersPosts = Model => async user => {
  const myFollowersPosts = await Model.find({
    postedBy: {
      $or: [{ $in: user.following },{ $in: user.follower }]
    }
  }).populate('postedBy')

  if(myFollowersPosts === null) return []

  return myFollowersPosts
}

module.exports = { getPosts, getPostById, getMyPosts, getMyFollowersPosts }