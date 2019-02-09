const path = require('path');

const express = require('express');
const isAuth = require('../middleware/is-auth');
const friendsController = require('../controllers/friends');

const router = express.Router();

router.get('/user-friends/:userId', isAuth, friendsController.getFriendsPage);
router.post(
  '/get-autocomplete-usernames',
  isAuth,
  friendsController.getAutocompleteUsernames
);
router.get('/check-user/:username', isAuth, friendsController.checkUser);
router.post(
  '/send-friend-request/:requestTargetId',
  isAuth,
  friendsController.sendFriendRequest
);

router.post('/accept-friend-request/:senderId',isAuth,friendsController.acceptFriendRequest);
module.exports = router;
