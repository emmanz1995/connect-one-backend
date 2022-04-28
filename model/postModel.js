const mongoose = require('mongoose')
const { Schema } = mongoose

const postModel = new Schema({
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

postModel.set('toJson', {
    transform: (doc, object) => {
        object.id = object._id.toString()
        delete object._id
        delete object.__v
    }
})
