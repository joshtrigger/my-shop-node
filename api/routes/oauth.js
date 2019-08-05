const router = require('express').Router();
const passport = require('passport');

function generateToken(request, response) {
    const payload = {userId: request._id, email: request.email};
    const token = jwt.sign(payload, process.env.SECRETKEY, {expiresIn: '1h'});
    return response.status(200).json({
        message: 'you have logged in successfully',
        token: token
    });
}

router.get('/google/callback', passport.authenticate('google'), (req, res, next) => {
    generateToken(req.user, res)
});

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res, next) => {
    generateToken(req.user, res)
});

router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/twitter/callback', passport.authenticate('twitter'), (req, res, next) => {
    generateToken(req.user, res)
});

router.get('/twitter', passport.authenticate('twitter'));

module.exports = router;
