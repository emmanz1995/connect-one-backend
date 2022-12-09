const mongoose = require('mongoose')
const {Schema} = mongoose

const postSchema = new Schema({
  content: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  postedBy: {
    ref: 'user',
    type: Schema.Types.ObjectId
  },
  likes: [{
    ref: 'user',
    type: Schema.Types.ObjectId
  }],
  comments: [{
    comment: String,
    postedBy: {type: Schema.Types.ObjectId, ref: 'user'}
  }]
}, {timestamps: true})

postSchema.set('toJSON', {
  transform: (doc, object) => {
    object.id = object._id.toString()
    delete object._id
    delete object.__v
  }
})

const Post = mongoose.model('post', postSchema)

module.exports = Post
