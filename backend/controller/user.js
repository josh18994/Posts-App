const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signupUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        user.save().then((result) => {
            res.status(201).json({
                message: 'User Sign Up Successful',
                result: TransformData([].concat(result))
            });
        }).catch((error) => {
            res.status(500).json({
                message: 'User Sign Up Failed, User already exists, Try loggin in',
                error
            });
        });
    });
};

exports.loginUser = (req, res, next) => {
    User.findOne({ username: req.body.username }).then((user) => {
        bcrypt.compare(req.body.password, user.password).then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Password incorrect'
                });
            }
            const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_Token, { expiresIn: '1h' });
            res.status(200).json({
                message: 'Login Sucessful',
                token,
                userId: user._id
            });
        }).catch(error => {
            res.status(500).json({
                message: 'Login Unsuccessful',
                error
            });
        });
    });
};

const TransformData = (data) => {
    return data.map(x => {
        return {
            userId: x._id,
            username: x.username
        }
    });
} 