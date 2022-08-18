const request = require('supertest')
const app = require('../app')

const api = request(app)

describe('test auth', () => {
    test('successfully login', async () => {
        const formData = {
            email: 'test@gmail.com',
            password: 'Testing@123?'
        }
        await api.post('/api/auth')
            .expect(200)
            .send(formData)
            .expect('content-type', /application\/json/)
    })
})