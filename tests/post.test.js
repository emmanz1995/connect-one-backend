const Posts = require('../model/postModel')
const Users = require('../model/userModel')
const supertest = require('supertest')
const app = require('../app')
const TestPostHelper = require('./testHelperFunctions')
const bcrypt = require('bcryptjs')

const api = supertest(app)

beforeEach(async () => {
  await Posts.deleteMany()
  await Users.deleteMany()

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = bcrypt.hash('Password@123?', salt)

  const user = new Users({
    name: "test user",
    username: "test",
    email: "testuser@gmail.com",
    dob: "1995-01-01",
    password: hashedPassword,
    avatar: "https://res.cloudinary.com/emmanuel-cloud-storage/image/upload/v1637458305/goow4psmt5vuzuffjr7a.jpg",
  })
  await user.save()
})

describe('make new post', async () => {
  test('POST - request Successful', async () => {
    const formData = {
      content: 'Hello World!',
      image: 'https://res.cloudinary.com/emmanuel-cloud-storage/image/upload/v1661526055/rh2hswz1t3uimxntecql.jpg',
      postedBy: '6305638ecdb97c9c337e58a3',
      likes: ['63055ed3cdb97c9c337e584b'],
      comments: ['']
    }
    await api
      .post('/api/post')
      .send(formData)
      .expect(201)
      .expect('content-type', /application\/json/)
    const content = await TestPostHelper.postsInDB()
  })
})