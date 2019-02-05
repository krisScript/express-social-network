const express = require('express');

const postsController = require('../controllers/posts');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const { body } = require('express-validator/check');

router.post(
  '/add-post',
  [
    body('title', 'Title must be atleast 3 characters long')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('postContent', 'Post should be atleast 5 letters')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  postsController.postAddPost
);

router.delete('/delete-post/:postId', isAuth, postsController.deletePost);

router.get('/get-edit-post/:postId', isAuth, postsController.getEditPost);

router.post(
  '/post-edit-post/:postId',
  [
    body('title', 'Title must be atleast 3 characters long')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('postContent', 'Post should be atleast 5 letters')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  postsController.postEditPost
);

module.exports = router;
