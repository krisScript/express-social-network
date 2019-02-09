const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String
  },
  resetToken: String,
  resetTokenExpiration: Date,
  friends: [
    {
      friendId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ]

  // postsData: {
  //   posts: [
  //     {
  //       postId: {
  //         type: Schema.Types.ObjectId,
  //         ref: 'Post',
  //         required: true
  //       }
  //     }
  //   ]
  // }
});

userSchema.methods.addFriend = function(friend) {
  const updatedFriends = [...this.friends];
  updatedFriends.push({
    friendId: friend._id
  });

  this.friends = updatedFriends;

  return this.save();
};

// userSchema.methods.removePost = post => {
//   const updatedPosts = this.postsData.posts.filter(item => {
//     return item.postId.toString() !== postId.toString();
//   });
//   this.postsData.messages = updatedPosts;
//   return this.save();
// };

// userSchema.methods.clearPosts = () => {
//   this.postsData = { posts: [] };
//   return this.save();
// };

module.exports = mongoose.model('User', userSchema);
