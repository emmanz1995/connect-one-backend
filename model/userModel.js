const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    post: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }]
}, { timestamps: true })

userSchema.set('toJSON', {
    transform: (doc, object) => {
        object.id = object._id.toString()
        delete object._id
        delete object.__v
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User
