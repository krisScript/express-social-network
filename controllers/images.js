const Image = require('../models/image');
const errorFunc = require('../util/errorFunc');
const User = require('../models/user');
const fileDelete = require('../util/fileDelete');
const { validationResult } = require('express-validator/check');
exports.getImages =async  (req, res, next) => {
    try{
        const images =   await Image.find({ userId: req.user._id });
        res.render('user/images', {
            title: 'Images',
            path: '/user-images',
            images,
            errorMessage: false,
            validationErrors: []
          });
    }
    catch(err){
        errorFunc(err,next)
    }
    
  
};

exports.postImages = async (req, res, next) => {
  try {
    const imageFile = req.file;
    const imageUrl = imageFile.path;
    const errors = validationResult(req);
    const {description} = req.body
    console.log(imageFile)
    if (!imageFile) {
      const images =   await Image.find({ userId: req.user._id });
        fileDelete(imageUrl)
        return res.status(422).render('user/images', {
          title: 'images',
          path: '/user-images',
          errorMessage: 'Attached file is not an image.',
          validationErrors: [],
          images
        });
        }
   if (!errors.isEmpty()) {
     fileDelete(imageUrl)
      return res.status(422).render('user/images', {
        path: '/user-images',
        title: 'Images',
        errorMessage: errors.array()[0].msg,
        signup: false,
        validationErrors: errors.array(),
        images
      });
    } else {
        console.log(imageUrl)
      const image = new Image({
        imageUrl,
        description,
        userName: req.user.userName,
        userId: req.user.id
      });
      
      await image.save();
      res.redirect('/user-images')
    }
  } catch (err) {
    errorFunc(err, next);
  }
};
