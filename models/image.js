const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', imageSchema);
