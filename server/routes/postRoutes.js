const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPosts);
router.get('/user/my-posts', protect, getUserPosts);
router.get('/:id', getPost);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;