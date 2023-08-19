const mongoose = require('mongoose')
const { savePost } = require('./save')
const { getPosts, getPostById, getMyPosts } = require('./get')
const { Schema } = mongoose

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: false,
    },
    image: {
      publicId: String,
      url: String,
    },
    postedBy: {
      ref: 'user',
      type: Schema.Types.ObjectId,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    comments: [
      {
        comment: String,
        postedBy: { type: Schema.Types.ObjectId, ref: 'user' },
      },
    ],
  },
  { timestamps: true }
)

postSchema.set('toJSON', {
  transform: (doc, object) => {
    object.id = object._id.toString()
    delete object._id
    delete object.__v
  },
})

const Post = mongoose.model('post', postSchema)

const SavePost = savePost(Post)
const FetchPosts = getPosts(Post)
const FetchPostById = getPostById(Post)
const FetchMyPosts = getMyPosts(Post)

module.exports = { Post, SavePost, FetchPosts, FetchPostById, FetchMyPosts }
