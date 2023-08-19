const { getPosts } = require('./get');

const Model = jest.fn(() => { find, findById });
Model.find = jest.fn()
Model.findById = jest.fn()

describe('get Post', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const payload = [{
    "image": {
      "publicId": "post-images/zenlqb2usalubc7xhm15",
      "url": "https://res.cloudinary.com/emmanuel-cloud-storage/image/upload/v1692454837/post-images/zenlqb2usalubc7xhm15.jpg"
    },
    "content": "Hello World!",
    "postedBy": "64e0c93a78cdf3dcf84d04bb",
    "likes": [],
    "comments": [],
    "createdAt": "2023-08-19T14:20:37.752Z",
    "updatedAt": "2023-08-19T14:20:37.752Z",
    "id": "64e0cfb50d1ea03656fe0911"
  },
    {
      "image": {
        "publicId": "post-images/v7fi1d8rq90lrueflnue",
        "url": "https://res.cloudinary.com/emmanuel-cloud-storage/image/upload/v1692462317/post-images/v7fi1d8rq90lrueflnue.jpg"
      },
      "content": "Hello World!",
      "postedBy": "64e0c93a78cdf3dcf84d04bb",
      "likes": [],
      "comments": [],
      "createdAt": "2023-08-19T16:25:18.250Z",
      "updatedAt": "2023-08-19T16:25:18.250Z",
      "id": "64e0ecee0a37b4fa82a7ad2d"
    }]
  it('should fetch all posts', async() => {
    Model.find.mockResolvedValue(payload)
    const posts = await getPosts(Model)({})

    expect(posts).toEqual(payload)
    expect(Model.find).toHaveBeenCalledTimes(1);
    expect(Model.find).toHaveBeenCalledWith({});
  })
  it('should return an empty array', async() => {
    Model.find.mockImplementationOnce(() => {
      const err = new Error('oops')
      err.statusCode = 500
      throw err
    })
    try {
      await getPosts(Model)({})
    } catch (err) {
      expect(err.message).toEqual('oops')
      expect(err.statusCode).toEqual(500)
    }
  })
})