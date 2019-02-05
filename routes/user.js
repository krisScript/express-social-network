const express = require('express');

const userRouter = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const {body} = require('express-validator/check');
router.get('/my-page', isAuth, userRouter.getMyPage);
router.post('/user-add-profile-picture',isAuth,userRouter.postAddProfilePicture)
module.exports = router;
