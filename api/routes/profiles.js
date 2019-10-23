const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profiles');
const auth = require('../middleware/authenticate')
const upload = require('../multer');

const fields = [{
    name: 'profilePic',
    maxCount: 1
  },
  {
    name: 'coverPhoto',
    maxCount: 1
  }
]

router.post('/user', auth, upload.fields(fields), profileController.createProfile);

router.get('/user', auth, profileController.getProfile)

router.put('/user', auth, profileController.updateProfile)

module.exports = router;