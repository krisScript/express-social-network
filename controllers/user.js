const Post = require('../models/post');
const errorFunc = require('../util/errorFunc');
const User = require('../models/user');
const fileDelete = require('../util/fileDelete')
exports.getMyPage = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user._id });
    const { userName, firstName, lastName, email,profilePicture } = req.user;
    res.render('user/my-page', {
      path: '/my-page',
      title: 'My Page',
      posts: posts.reverse(),
      userName,
      firstName,
      lastName,
      profilePicture,
      email,
      errorMessage:false
    });
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.postAddProfilePicture = async (req, res, next) => {
  try {
    const image = req.file;
    console.log(image)
    if (!image) {
      const { userName, firstName, lastName, email,profilePicture } = req.user;
      const posts = await Post.find({ userId: req.user._id });
      return res.status(422).render('user/my-page', {
        title: 'My Page',
        path: '/my-page',
        posts: posts.reverse(),
        userName,
        firstName,
        lastName,
        profilePicture,
        email,
        errorMessage: 'Attached file is not an image.',
        validationErrors: []
      });
      }
  
      const oldImgUrl = req.user.profilePicture
      fileDelete(oldImgUrl)
     
    const imageUrl = image.path;
   await User.findOneAndUpdate({ _id: req.user._id },{ $set: { 'profilePicture': imageUrl} });
   res.redirect('/my-page')
  } catch (err) {
    errorFunc(err, next);
  }
};
4