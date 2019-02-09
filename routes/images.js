const express = require('express');

const imagesRouter = require('../controllers/images');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
const { body } = require('express-validator/check');

router.get('/user-images/:userId', isAuth, imagesRouter.getImages);
router.post(
  '/user-images/:UserId',
  [
    body('description', 'Description must be atleast 3 characters long')
      .isString()
      .isLength({ min: 3 })
      .trim()
  ],
  isAuth,
  imagesRouter.postImages
);

router.get('/delete-image/:imageId', isAuth, imagesRouter.deleteImage);

module.exports = router;
