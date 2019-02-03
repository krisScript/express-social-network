const express = require('express');

const postsController = require('../controllers/posts');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const {body} = require('express-validator/check');
// router.get('/add-message', isAuth, postsController.getAddMessage);
// router.get('/messages', isAuth, postsController.getAllMessages);

// router.get('/user-messages', isAuth, postsController.getUserMessages);

router.post(
  '/add-post',
  [
    body('title','Title must be atleast 3 characters long')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('postContent','Post should be atleast 5 letters')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  postsController.postAddPost
);

// router.get(
//   '/edit-message/:messageId',
//   isAuth,
//   postsController.getEditMessage
// );

// router.post(
//   '/edit-message',
//   [
//     body('title','Invalid Title')
//       .isString()
//       .isLength({ min: 1 })
//       .trim(),
//     body('messageContent','Message should be atleast 5 letters')
//       .isLength({ min: 5, max: 400 })
//       .trim()
//   ],
//   isAuth,
//   postsController.postEditMessage
// );

// router.post('/delete-message', isAuth, postsController.postDeleteMessage);

module.exports = router;
