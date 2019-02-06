const path = require('path');

const express = require('express');
const isAuth = require('../middleware/is-auth');
const friendsController = require('../controllers/friends');

const router = express.Router();

router.get('/user-friends',isAuth,friendsController.getFriendsPage);
router.post('/get-autocomplete-user-names',isAuth,friendsController.getAutocompleteUserNames)

router.post('/get-user',isAuth,friendsController.getUser)
module.exports = router;
