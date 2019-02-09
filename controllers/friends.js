const User = require('../models/user');
const errorFunc = require('../util/errorFunc');
const FriendRequest = require('../models/friendRequest');
var mongoose = require('mongoose');

const redis = require('redis');
const client = redis.createClient();
const cacheTime = 2000000
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
exports.getAutocompleteUsernames = async (req, res, next) => {
  try {
    const { value } = req.body;
    client.get(value,async (err, data) => {
      if (data) {
        console.log('cached')
        console.log(data)
        return res.status(200).json({ data });
      } else {
        const autocompleteData = await User.find({
          username: new RegExp(value, 'i')
        }).select('username ');
        if (autocompleteData.length > 0) {
          const autocompleteNames = autocompleteData.map(entry => {
            return entry.username;
          });
          client.setex(value, cacheTime, JSON.stringify(autocompleteNames));
          console.log('not cahced')
          return res.status(200).json({ autocompleteNames });
        } else {
          return res.status(200).json({ msg: 'No users found' });
        }
      }
    });
    
  } catch (err) {
    errorFunc(err, next);
  }
};
exports.checkUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const selectedUser = await User.find({ username });
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
        senderUsername:req.user.username,
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