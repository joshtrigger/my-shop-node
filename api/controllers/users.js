const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TP_EMAIL,
        pass: process.env.TP_PASSWORD
    }
});

function jwtSignature(payload) {
    const token = jwt.sign(payload, process.env.SECRETKEY, {
        expiresIn: '1h'
    });
    return token;
}
const signup = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(409).json({
                error: "User already exists"
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
            
            user
            .save()
            .then(() => {
                res.status(201).json({
                    message: `Welcome ${
                        req.body.username
                    }, you have been successfully registered`
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        }
    });
};

const login = (req, res) => {
    if (req.body.password === '' || req.body.password === null) {
        return res.status(400).json({
            error: {
                message: 'password field cannot be blank'
            }
        });
    }
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            bcrypt.compare(req.body.password, user.password, (err, response) => {
                if (response) {
                    const payload = {
                        userId: user._id,
                        email: user.email,
                        username: user.username
                    };
                    const token = jwtSignature(payload);
                    res.status(200).json({
                        message: 'you have logged in successfully',
                        token: token
                    });
                } else {
                    res.status(401).json({
                        error: {
                            message: 'Authentication failure'
                        }
                    });
                }
            });
        })
        .catch(() => {
            res.status(500).json({
                error: 'User with this email does not exist'
            });
        });
};

const passwordResetRequest = (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(result => {
            if (result) {
                const payload = {
                    userId: result._id,
                    email: result.email
                };
                const token = jwtSignature(payload);
                const url = `${process.env.BASE_URL}user/reset_password/${token}`;
                const mailOptions = {
                    from: process.env.TP_EMAIL,
                    to: `${result.email}`,
                    subject: 'Password Reset',
                    html: `
                    <h2>My Shop Password reset request</h2>
                    <p>
                        Hello ${result.username},<br>
                        
                        A password reset has been requested, please click on the link below to<br>
                        to reset your password then try logging in. Link expires after an hour<br>
                        
                        <a href=${url}>Click here</a><br>
                    </p>
                `
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        res.status(200).json(info);
                    }
                });
            } else {
                res.status(500).json({
                    error: ''
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

const resetPassword = (req, res) => {
    const id = jwt.verify(req.params.signature, process.env.SECRETKEY);
    const a = req.body.newPassword;
    const b = req.body.confirmPassword;
    console.log(id.userId)
    User.findById({
            _id: id.userId
        })
        .exec()
        .then(result => {
            if (result && a === b) {
                //update the password form here
                bcrypt.hash(a, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        User.findOneAndUpdate({
                                _id: id.userId
                            }, {
                                password: hash
                            },
                            (err, data) => {
                                if (err) {
                                    res.status(500).json(err);
                                } else {
                                    res.status(200).json({
                                        message: 'Password has been reset successfully',
                                        data: data
                                    });
                                }
                            }
                        );
                    }
                });
            } else if (a !== b) {
                return res.status(400).json({
                    error: {
                        message: 'Passwords do not match'
                    }
                });
            } else if (a !== '' || b !== '') {
                return res.status(400).json({
                    error: {
                        message: 'Fields cannot be blank'
                    }
                });
            } else {
                return res.status(400).json({
                    error: 'user does not exist'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

module.exports = {
    signup,
    login,
    passwordResetRequest,
    resetPassword
};