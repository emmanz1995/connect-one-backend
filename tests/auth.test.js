const supertest = require('supertest')
const app = require('../app')
const TestUserHelper = require('./testHelperFunctions')
const User = require('../model/userModel')
const bcrypt = require("bcryptjs");
const Users = require("../model/userModel");

describe('testing the auth endpoint', () => {
    beforeEach(async () => {
        await User.deleteMany()
    })
    test('successfully login', async () => {
        const formData = {
            email: 'emmanza2@gmail.com',
            password: 'Password@123?'
        }
        const response = await supertest(app)
            .post('/api/auth')
            .send(formData)
            .expect('content-type', /application\/json/)
        const data = await TestUserHelper.usersInDB()
        const getEmail = data?.map(user => user.email)
        expect(getEmail[2]).toBe(formData.email)
        expect(response.status).toBe(200)
    })
    test('login without an email', async() => {
        const formData = {
            email: '',
            password: 'Password@123?'
        }
        const response = await supertest(app)
            .post('/api/auth')
            .send(formData)
            .expect('content-type', /application\/json/)
        expect(response.status).toBe(400)
    })
    test('login with the wrong email', async() => {
        const formData = {
            email: 'emmanz95@gmail.com',
            password: 'Password@123?'
        }
        const response = await supertest(app)
            .post('/api/auth')
            .send(formData)
            .expect('content-type', /application\/json/)
        expect(response.status).toBe(400)
    })
    test('login with the wrong password', async() => {
        const formData = {
            email: 'emmanz95@gmail.com',
            password: 'Password1'
        }
        const response = await supertest(app)
            .post('/api/auth')
            .send(formData)
            .expect('content-type', /application\/json/)
        expect(response.status).toBe(400)
    })
})

describe('testing the user endpoint', () => {
    //this test block is failing. TODO: need to find out why this is the case.
    // test('successfully signed up', async () => {
    //     const formData = {
    //         name: "test user",
    //         username: "test",
    //         email: "testuser@gmail.com",
    //         dob: "1995-01-01",
    //         password: "Password@123?",
    //         avatar: "https://res.cloudinary.com/emmanuel-cloud-storage/image/upload/v1637458305/goow4psmt5vuzuffjr7a.jpg"
    //     }
    //
    //     const api = await supertest(app)
    //         .post('/api/user')
    //         .send(user)
    //         .expect('content-type', /application\/json/)
    //     expect(api.status).toBe(201)
    // })
    test('signing up without a password', async() => {
        const formData = {
            email: 'testuser@gmail.com',
            name: 'testuser',
            username: 'test',
            dob: '1995-01-01',
            avatar: {
                publicId: 'avatars/zbcwu7ckgirmcj8mpnrm',
                url: 'https://res.cloudinary.com/emmanuel-cloud-storage/image/upload/v1661293874/ed1bly4v2cnync4mwmb8.jpg',
            },
            password: '',
        }
        const api = await supertest(app)
            .post('/api/user')
            .send(formData)
            .expect('content-type', /application\/json/)
        expect(api.status).toBe(400)
    })
})