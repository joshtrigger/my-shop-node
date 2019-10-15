const mongoose = require('mongoose');
const UserProfile = require('../models/profile')
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const cloudinary = require('../cloudinary')

const uploader = async (path) => await cloudinary.uploads(path, 'Profiles')

const createProfile = async (req, res, next) => {
  const urls = []
  const paths = [req.files.profilePic[0].path, req.files.coverPhoto[0].path];
  for (const path of paths) {
    const f = await uploader(path)
    urls.push(f)
  }
  console.log(urls)

  res.status(200).json({
    data: 'upload'
  })

}

const getProfile = (req, res, next) => {

}

const updateProfile = (req, res, next) => {

}

module.exports = {
  createProfile,
  getProfile,
  updateProfile
}