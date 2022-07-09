const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

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
    post: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    avatar: {
        type: String
    },
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    follower: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
}, {
    timestamps: true
})

userSchema.set('toJSON', {
    transform: (doc, object) => {
        object.id = object._id.toString()
        delete object._id
        delete object.__v
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.comparePassword = (async function(password) {
    const compare = await bcrypt.compare(password, this.password)
    return compare
})

const User = mongoose.model('user', userSchema)

module.exports = User
