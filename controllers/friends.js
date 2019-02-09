const User = require('../models/user');
const errorFunc = require('../util/errorFunc');
const FriendRequest = require('../models/friendRequest');
var mongoose = require('mongoose');
exports.getFriendsPage = async (req, res, next) => {
  try {
     await req.user.populate('friends.friendId')
    .execPopulate()
    const {friends} = req.user
    console.log(friends)
    res.render('friends/friends', {
      title: 'friends',
      path: '/user-friends',
      errorMessage: false,
      validationErrors: [],
      friends
    });
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.getAutocompleteUserNames = async (req, res, next) => {
  try {
    const { value } = req.body;
    const autocompleteData = await User.find({
      userName: new RegExp(value, 'i')
    }).select('userName ');
    if (autocompleteData.length > 0) {
      const autocompleteNames = autocompleteData.map(entry => {
        return entry.userName;
      });
      return res.status(200).json({ autocompleteNames });
    } else {
      return res.status(200).json({ msg: 'No users found' });
    }
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.checkUser = async (req, res, next) => {
  try {
    const { userName } = req.params;
    const selectedUser = await User.find({ userName });
    if (selectedUser[0]) {
      const selectedUserId = selectedUser[0]._id;
      res.status(200).json({ userId: selectedUserId });
    } else {
      res.status(404).json({ msg: 'User Not Found!' });
    }
  } catch (err) {
    console.log(err);
    errorFunc(err, next);
  }
};
exports.sendFriendRequest = async (req, res, next) => {
  try {
    const { requestTargetId } = req.params;
    const authUserId = req.user._id.toString();
    if (requestTargetId === authUserId) {
    } else {
      const friendRequest = new FriendRequest({
        senderUserName:req.user.userName,
        sender: mongoose.Types.ObjectId(authUserId),
        receiver: mongoose.Types.ObjectId(requestTargetId)
      });
      console.log(friendRequest)
      await friendRequest.save();
      res.status(200).json({ msg: 'Request send' });
    }
  } catch (err) {
    errorFunc(err, next);
  }
};

exports.acceptFriendRequest = async (req,res,next) => {
  try {
    const senderId = req.params.senderId;
    const receiverId  = req.user._id
    const acceptedRequest = await FriendRequest.findOneAndDelete({sender:senderId,receiver:receiverId})
    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId)
    await sender.addFriend(receiver)
    await receiver.addFriend(sender)
    res.redirect(`/user-page/${receiverId}`)
  } catch (err) {
    errorFunc(err, next);
  }
}