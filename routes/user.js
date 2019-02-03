const express = require('express');

const userRouter = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const {body} = require('express-validator/check');
router.get('/my-page', isAuth, userRouter.getMyPage);
// router.get('/messages', isAuth, userRouter.getAllMessages);

// router.get('/user-messages', isAuth, userRouter.getUserMessages);

// router.post(
//   '/add-post',
//   [
//     body('title','Title must be atleast 3 characters long')
//       .isString()
//       .isLength({ min: 3 })
//       .trim(),
//     body('postContent','Post should be atleast 5 letters')
//       .isLength({ min: 5, max: 400 })
//       .trim()
//   ],
//   isAuth,
//   userRouter.postAddPost
// );

// router.get(
//   '/edit-message/:messageId',
//   isAuth,
//   userRouter.getEditMessage
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
//   userRouter.postEditMessage
// );

// router.post('/delete-message', isAuth, userRouter.postDeleteMessage);

module.exports = router;
