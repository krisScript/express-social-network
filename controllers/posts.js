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
    const { user } = req;
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
      console.log(user);
      console.log(post);
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
    console.log(req.params)
    console.log(postId)
    const post = await Post.find({ _id: postId }).select('title postContent');
    console.log(post)
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: 'Post Not Found' });
    }
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.postEditPost = async (req,res,next) => {
  try{
    const {title,postContent}  = req.body
    const {postId} = req.params
    const post = {
      title,
      postContent
    }
    await Post.findOneAndUpdate({_id:postId},post)
    res.status(200).json({msg:'updated'})
  }catch(err){
    errorFunc(err,next)
  }
  
}
// exports.getUserMessages = (req, res, next) => {
//   Message.find({ userId: req.user._id })
//     .then(messages => {
//       res.render('messages/messages', {
//         messages,
//         title: 'My Messages',
//         path: '/user-messages',
//         user: true
//       });
//     })
//     .catch(error => {
//       throw error;
//     });
// };
// exports.getAllMessages = (req, res, next) => {
//   Message.find()
//     .then(messages => {
//       res.render('messages/messages', {
//         messages,
//         title: 'Messages',
//         path: '/messages',
//         user: false
//       });
//     })
//     .catch(error => {
//       throw error;
//     });
// };
// exports.postDeleteMessage = (req, res, next) => {
//   const { messageId } = req.body;
//   Message.deleteOne({ _id: messageId, userId: req.user._id })
//     .then(() => {
//       res.redirect('/user-messages');
//     })
//     .catch(error => {
//       throw error;
//     });
// };

//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     return res.status(422).render('messages/add-message', {
//       title: 'Add Message',
//       path: '/add-message',
//       editing: false,
//       hasError: true,
//       message: {
//         title,
//         messageContent
//       },
//       errorMessage: errors.array()[0].msg,
//       validationErrors: errors.array()
//     });
//   }
//   const message = new Message({
//     title,
//     messageContent,
//     userId: req.user
//   });
//   message
//     .save()
//     .then(result => {
//       res.redirect('/messages');
//     })
//     .catch(error => {
//       {
//         throw error;
//       }
//     });
// };

// exports.getEditMessage = (req, res, next) => {
//   const { edit } = req.query;

//   if (!edit) {
//     return res.redirect('/');
//   }
//   const { messageId } = req.params;
//   Message.findById(messageId)
//     .then(message => {
//       if (!message) {
//         return res.redirect('/');
//       }
//       res.render('messages/add-message', {
//         title: 'Edit Message',
//         path: '/edit-message',
//         editing: edit,
//         message,
//         hasError: false,
//         errorMessage: null,
//         validationErrors: []
//       });
//     })
//     .catch(error => {
//       throw error;
//     });
// };

// exports.postEditMessage = (req, res, next) => {
//   const { messageId } = req.body;
//   const updatedTitle = req.body.title;
//   const updatedMessageContent = req.body.messageContent;

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).render('messages/add-message', {
//       title: 'Edit Message',
//       path: '/edit-message',
//       editing: true,
//       hasError: true,
//       message: {
//         title: updatedTitle,
//         messageContent: updatedMessageContent,
//         _id: messageId
//       },
//       errorMessage: errors.array()[0].msg,
//       validationErrors: errors.array()
//     });
//   }
//   Message.findById(messageId)
//     .then(message => {
//       if (message.userId.toString() !== req.user._id.toString()) {
//         return res.redirect('/');
//       }
//       message.title = updatedTitle;
//       message.messageContent = updatedMessageContent;
//       return message.save().then(result => {
//         res.redirect('/user-messages');
//       });
//     })
//     .catch(error => {
//       throw error;
//     });
