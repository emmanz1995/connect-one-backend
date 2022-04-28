const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema({
    content: {
        type: String,
        required: true
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
    }]
}, { timestamps: true })

postSchema.set('toJSON', {
    transform: (doc, object) => {
        object.id = object._id.toString()
        delete object._id
        delete object.__v
    }
})

const Post = mongoose.model('post', postSchema)

module.exports = Post
