const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pinterest');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  }
});

module.exports = mongoose.model('Post', postSchema);

