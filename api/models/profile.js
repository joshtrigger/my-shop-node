const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  login: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gender: String,
  name: {
    first: {
      type: String,
      required: true
    },
    middle: String,
    last: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  pictures: {
    profilePic: String,
    coverPhoto: String
  },
  location: {
    country: String,
    city: String,
    address: String,
    town: String
  }
})

module.exports = mongoose.model('UserProfile', profileSchema);