const Post = require('../models/post');
const errorFunc = require('../util/errorFunc');
const User = require('../models/user');
exports.getMyPage = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user._id });
    const { userName, firstName, lastName, email } = req.user;
    res.render('user/my-page', {
      path: '/my-page',
      title: 'My Page',
      posts: posts.reverse(),
      userName,
      firstName,
      lastName,
      email,
      errorMessage: false
    });
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.postAddProfilePicture = async (req, res, next) => {
  try {
    const image = req.file;
    if (!image) {
      const posts = await Post.find({ userId: req.user._id });
      const { userName, firstName, lastName, email } = req.user;
      return res.status(422).render('user/my-page', {
        title: 'My Page',
        path: '/my-page',
        posts: posts.reverse(),
        userName,
        firstName,
        lastName,
        email,
        errorMessage: 'Attached file is not an image.',
        validationErrors: []
      });
    }
    const imageUrl = image.path;
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profilePicture: imageUrl } }
    );
    res.redirect('/my-page');
  } catch (err) {
    errorFunc(err, next);
  }
};
