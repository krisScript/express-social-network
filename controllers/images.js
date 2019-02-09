const Image = require('../models/image');
const errorFunc = require('../util/errorFunc');
const User = require('../models/user');
const fileDelete = require('../util/fileDelete');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check');
exports.getImages = async (req, res, next) => {
  try {
    const pageOwnerId = req.params.userId;
    const images = await Image.find({ userId: pageOwnerId });
    let autorized;
    autorized = false
    if (pageOwnerId.toString() === req.user._id.toString()) {
      autorized = true;
    } else {
      autorized = false;
    }
    res.render('user/images', {
      title: 'Images',
      path: '/user-images',
      images,
      autorized,
      errorMessage: false,
      validationErrors: []
    });
  } catch (err) {
    errorFunc(err, next);
  }
};

exports.postImages = async (req, res, next) => {
  try {
    const imageFile = req.file;
    const imageUrl = imageFile.path;
    const errors = validationResult(req);
    const { description } = req.body;
    const pageOwnerId = req.params.userId;
    const images = await Image.find({ userId: req.user._id });
    console.log(images)
    if (!imageFile) {
      fileDelete(imageUrl);
      return res.status(422).render('user/images', {
        title: 'images',
        path: '/user-images',
        errorMessage: 'Attached file is not an image.',
        validationErrors: [],
        images
      });
    }
    if (!errors.isEmpty()) {
      fileDelete(imageUrl);
      return res.status(422).render('user/images', {
        path: '/user-images',
        title: 'Images',
        autorized:true,
        pageOwnerId,
        errorMessage: errors.array()[0].msg,
        signup: false,
        validationErrors: errors.array(),
        images
      });
    } else {
      const image = new Image({
        imageUrl,
        description,
        userName: req.user.userName,
        userId: req.user._id
      });

      await image.save();
      res.redirect(`/user-images/${req.user._id}`);
    }
  } catch (err) {
    errorFunc(err, next);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const imageItem = await Image.findById(imageId);
    fileDelete(imageItem.imageUrl);
    await Image.findByIdAndDelete({ _id: imageId });

    res.redirect(`/user-images/${req.user._id}`);
  } catch (err) {
    errorFunc(err, next);
  }
};
