const supertest = require('supertest')
const app = require('../app')
const TestUserHelper = require('./testHelperFunctions')
const User = require('../model/userModel')

const api = supertest(app)

describe('test auth', () => {
    // beforeEach(async () => {
    //     await User.deleteMany()
    // })
    test('successfully signed up', async () => {
        const formData = {
            email: 'testuser@gmail.com',
        }
    })
    test('successfully login', async () => {
        const formData = {
            email: 'emmanza2@gmail.com',
            password: 'Password@123?'
        }
        await api.post('/api/auth')
            .expect(200)
            .send(formData)
            .expect('content-type', /application\/json/)
        const data = await TestUserHelper.usersInDB()
        const getEmail = data?.map(user => user.email)
        expect(getEmail[2]).toBe(formData.email)
    })
})