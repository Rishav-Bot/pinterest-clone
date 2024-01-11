const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pinterest');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  dp: {
    type: String, // Assuming the profile picture is stored as a string (file path or URL)
  },
  contact: {
    type: Number,
  },
  boards: {
    type: Array,
    default: []
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId, // Assuming each post is a string, you can adjust the type accordingly
    ref: 'Post'
  }],
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);


