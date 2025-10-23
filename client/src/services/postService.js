import API from './api';

const getPosts = async (page = 1, limit = 10) => {
  const response = await API.get(`/posts?page=${page}&limit=${limit}`);
  return response.data;
};

const getPost = async (id) => {
  const response = await API.get(`/posts/${id}`);
  return response.data;
};

const createPost = async (postData) => {
  const response = await API.post('/posts', postData);
  return response.data;
};

const updatePost = async (id, postData) => {
  const response = await API.put(`/posts/${id}`, postData);
  return response.data;
};

const deletePost = async (id) => {
  const response = await API.delete(`/posts/${id}`);
  return response.data;
};

const getUserPosts = async () => {
  const response = await API.get('/posts/user/my-posts');
  return response.data;
};

const postService = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
};

export default postService;