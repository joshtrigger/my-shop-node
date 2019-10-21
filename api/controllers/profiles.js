const mongoose = require('mongoose');
const UserProfile = require('../models/profile')
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const cloudinary = require('../cloudinary')
const fs = require('fs')

const uploader = async (path) => await cloudinary.uploads(path, 'Profiles')

function getUserData(headers) {
  const token = headers.split(' ')[1]
  const decoded = jwt.verify(token, process.env.SECRETKEY)
  return decoded;
}
const createProfile = async (req, res) => {
  const token = getUserData(req.headers.authorization)
  const urls = []
  const paths = [req.files.profilePic[0].path, req.files.coverPhoto[0].path];
  for (const path of paths) {
    const f = await uploader(path)
    urls.push(f)
    fs.unlinkSync(path)
  }

  const profile = new UserProfile({
    _id: new mongoose.Types.ObjectId(),
    name: {
      first: req.body.firstName,
      middle: req.body.middleName,
      last: req.body.lastName
    },
    gender: req.body.gender,
    phone: req.body.phone,
    pictures: {
      profilePic: urls[0].url,
      coverPhoto: urls[1].url
    },
    location: {
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      town: req.body.town
    },
    email: token.email,
    login: token.userId
  })

  User.findById({
      _id: token.userId
    })
    .exec()
    .then(() => {
      profile.save()
        .then(result => {
          res.status(200).json({
            user: result
          })
        })
        .catch(err => {
          console.log('error when trying to save', err)
        })
    })
    .catch(err => console.log('error that occured ', err))


}

const getProfile = (req, res) => {
  const userEmail = getUserData(req.headers.authorization).email
  UserProfile.findOne({
      email: userEmail
    })
    .populate('login')
    .exec()
    .then(result => {
      res.status(200).json({
        user: result
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

const updateProfile = (req, res) => {
  const userEmail = getUserData(req.headers.authorization).email;
  const newData = {
    name: {
      first: req.body.firstName,
      middle: req.body.middleName,
      last: req.body.lastName
    },
    location: {
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      town: req.body.town
    },
    gender: req.body.gender,
    phone: req.body.phone
  }

  UserProfile.findOneAndUpdate({
      email: userEmail
    }, newData)
    .then(() => {
      res.status(200).json({
        message: "Successfully updated profile"
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

module.exports = {
  createProfile,
  getProfile,
  updateProfile
}