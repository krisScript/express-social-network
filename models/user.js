const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
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
  resetToken: String,
  resetTokenExpiration: Date,
  postsData: {
    posts: [
      {
        postId: {
          type: Schema.Types.ObjectId,
          ref: 'Message',
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addPost = post => {
  const updatedPosts = [...this.postsData.posts, post];
  updatedPosts.push({
    postId: post._id
  });

  const updatedPostsData = {
    posts: updatedPosts
  };
  this.postsData = updatedPostsData;
  return this.save();
};

userSchema.methods.removePost = post => {
  const updatedPosts = this.postsData.posts.filter(item => {
    return item.postId.toString() !== postId.toString();
  });
  this.postsData.messages = updatedPosts;
  return this.save();
};

userSchema.methods.clearPosts = () => {
  this.postsData = { posts: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
