const Post = require('../model/postModel')
const User = require('../model/userModel')

const initialUser = [
    {
        name: 'Emmanuel Okuchukwu',
        username: 'emmanz95',
        email: 'emmanza2@gmail.com',
        dob: '1995-06-28',
        post: [],
        avatar: {
            publicId: 'avatars/zbcwu7ckgirmcj8mpnrm',
            url: '',
        },
        following: [],
        follower: [],
        bookmarks: [],
        password: 'Password@123?',
    }
]

const usersInDB = async () => {
    const users = await User.find({})
    return users?.map((user) => user.toJSON())
}

const initialPosts = [
    {
        id: '6255852bbe1bad469d7d0r43',
        content: 'Hello World!',
        image: 'https://res.cloudinary.com/emmanuel-cloud-storage/image/upload/v1661880760/veccyvrkklvzdvsqweiq.jpg',
        postedBy: '6305638ecdb97c9c337e58a3',
        likes: ['6305638ecdb97c9c337e58a3'],
        comments: ['']
    },
    {
        id: '6255854913525656af03c4re',
        content: 'Hello World new!',
        image: 'https://res.cloudinary.com/emmanuel-cloud-storage/image/upload/v1661895620/ff02nurvi6ociy4vsg8y.jpg',
        postedBy: '6305638ecdb97c9c337e58a3',
        likes: ['6305638ecdb97c9c337e58a3', '63055ed3cdb97c9c337e584b'],
        comments: ['']
    }
]

const postsInDB = async () => {
    const posts = await Post.find({})
    return posts.map((post) => post.toJSON())
}


module.exports = { initialUser, usersInDB, initialPosts, postsInDB }
