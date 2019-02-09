const express = require('express');

const userRouter = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const { body } = require('express-validator/check');
router.get('/user-page/:userId', isAuth, userRouter.getUserPage);
router.post('/user-page/:userId', isAuth, userRouter.postAddProfilePicture);

module.exports = router;
