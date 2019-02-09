const Post = require('../models/post');
const { validationResult } = require('express-validator/check');
const errorFunc = require('../util/errorFunc');
exports.getAddMessage = (req, res, next) => {
  res.render('messages/add-message', {
    title: 'Add Message',
    path: '/add-message',
    editing: false,
    errorMessage: false,
    validationErrors: []
  });
};

exports.postAddPost = async (req, res, next) => {
  try {
    const { title, postContent } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;
      res.json({ error: errorMsg });
    } else {
      const post = new Post({
        title,
        postContent,
        userName: req.user.userName,
        userId: req.user.id
      });
      await post.save();
      res.status(200).json({ msg: 'Post succesfully added', postId: post._id });
    }
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete({ _id: postId });
    res.status(200).json({ msg: 'postDeleted' });
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.getEditPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.find({ _id: postId }).select('title postContent');

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: 'Post Not Found' });
    }
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.postEditPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;
      res.json({ error: errorMsg });
    } else {
      const { title, postContent } = req.body;
      const { postId } = req.params;
      const post = {
        title,
        postContent
      };
      await Post.findOneAndUpdate({ _id: postId }, post);
      res.status(200).json({ msg: 'updated' });
    }
  } catch (err) {
    errorFunc(err, next);
  }
};
