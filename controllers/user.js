const Post = require('../models/post');
const errorFunc = require('../util/errorFunc');
const User = require('../models/user');
const fileDelete = require('../util/fileDelete');
exports.getUserPage = async (req, res, next) => {
  try {
    const pageOwnerId = req.params.userId;
    const authUserId = req.user._id.toString();
    const pageOwnerUser = await User.findById(pageOwnerId)
    let autorized;
    if (authUserId === pageOwnerId) {
      autorized = true;
      
    }else {
      autorized = false
    }
    const  {userName, firstName, lastName, email, profilePicture } = pageOwnerUser
    const posts = await Post.find({ userId: pageOwnerId });
    console.log(posts)
    res.render('user/user-page', {
      pageOwnerId,
      path: '/user-page',
      title: 'My Page',
      posts: posts.reverse(),
      userName,
      firstName,
      lastName,
      profilePicture,
      email,
      autorized,
      errorMessage: false,
    });
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.postAddProfilePicture = async (req, res, next) => {
  try {
    const image = req.file;
    console.log(image);
    if (!image) {
      const { userName, firstName, lastName, email, profilePicture } = req.user;

      const posts = await Post.find({ userId: req.user._id });
      return res.status(422).render('user/user-page', {
        title: 'My Page',
        path: '/user-page',
        posts: posts.reverse(),
        userName,
        firstName,
        lastName,
        profilePicture,
        email,
        errorMessage: 'Attached file is not an image.',
        validationErrors: [],
        autorized: true
      });
    }

    const oldImgUrl = req.user.profilePicture;
    fileDelete(oldImgUrl);

    const imageUrl = image.path;
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profilePicture: imageUrl } }
    );
    res.redirect(`/user-page/${req.user._id}`);
  } catch (err) {
    errorFunc(err, next);
  }
};
4;
