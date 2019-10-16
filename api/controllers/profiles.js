const mongoose = require('mongoose');
const UserProfile = require('../models/profile')
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const cloudinary = require('../cloudinary')
const fs=require('fs')

const uploader = async (path) => await cloudinary.uploads(path, 'Profiles')

const createProfile = async (req, res, next) => {
  const urls = []
  const paths = [req.files.profilePic[0].path, req.files.coverPhoto[0].path];
  for (const path of paths) {
    const f = await uploader(path)
    urls.push(f)
    fs.unlinkSync(path)
  }
  const jwttoken = req.headers.authorization.split(' ');
  const token = jwt.verify(jwttoken[1], process.env.SECRETKEY)

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

const getProfile = (req, res, next) => {
  const id = req.params.id
  UserProfile.findById({
      _id: id
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

const updateProfile = (req, res, next) => {

}

module.exports = {
  createProfile,
  getProfile,
  updateProfile
}