const path = require('path');

const express = require('express');
const isAuth = require('../middleware/is-auth');
const friendsController = require('../controllers/friends');

const router = express.Router();

router.get('/user-friends/:userId', isAuth, friendsController.getFriendsPage);
router.post(
  '/get-autocomplete-user-names',
  isAuth,
  friendsController.getAutocompleteUserNames
);
router.get('/check-user/:userName', isAuth, friendsController.checkUser);
router.post(
  '/send-friend-request/:requestTargetId',
  isAuth,
  friendsController.sendFriendRequest
);

router.post('/accept-friend-request/:senderId',isAuth,friendsController.acceptFriendRequest);
module.exports = router;
