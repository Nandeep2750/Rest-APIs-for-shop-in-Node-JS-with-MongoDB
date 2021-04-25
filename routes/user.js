const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Joi = require('joi');
const router = express.Router()
const UserModel = require('../models/user')

router.post('/signup', (req, res, next) => {
    const { body } = req;

    const userSignupSchema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().min(3).max(20).required()
    });
    const { error, value } = userSignupSchema.validate(body);

    if (error) {
        return res.status(500).json({
            message: error.message,
        })
    } else {

        UserModel.findOne({ email: body.email })
            .exec()
            .then((user) => {
                if (user) {
                    return res.status(409).json({
                        message: "This email is already registered please use another one."
                    })
                } else {
                    bcrypt.hash(body.password, 10, function (err, hash) {
                        if (err) {
                            console.log("🚀 ~ file: user.js ~ line 33 ~ err", err)
                            return res.status(500).json({
                                message: err.message
                            })
                        } else {
                            let user = new UserModel({
                                _id: new mongoose.Types.ObjectId(),
                                email: body.email,
                                password: hash
                            })
                            user.save()
                                .then((result) => {
                                    return res.status(201).json({
                                        message: "User registered sucessfully.",
                                        data: result
                                    })
                                })
                                .catch((err) => {
                                    console.log("🚀 ~ file: user.js ~ line 51 ~ err", err)
                                    return res.status(500).json({
                                        message: err.message
                                    })
                                });
                        }
                    });
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: user.js ~ line 61 ~ router.post ~ err", err)
                return res.status(500).json({
                    message: err.message
                })
            })
    }
})


module.exports = router