const savePost = Model => async payload => {
  const saveNewPost = new Model(payload)
  return await saveNewPost.save()
}

const updatePost = Model => async id => {}

module.exports = { savePost, updatePost }
