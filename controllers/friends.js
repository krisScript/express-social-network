const User = require('../models/user');
const errorFunc = require('../util/errorFunc');
exports.getFriendsPage = async (req, res, next) => {
  try {
    res.render('friends/friends', {
      title: 'friends',
      path: '/user-friends',
      errorMessage: false,
      validationErrors: []
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
   const {userName}  = req.params
   const selectedUser = await User.find({userName})
   if(selectedUser[0]){
     const selectedUserId = selectedUser[0]._id
     res.status(200).json({ userId: selectedUserId });
   }else {
     res.status(404).json({msg:'User Not Found!'})
   }
  } catch (err) {
    console.log(err)
    errorFunc(err, next);
  }
};