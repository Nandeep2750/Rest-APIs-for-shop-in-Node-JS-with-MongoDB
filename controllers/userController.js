const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken')

const UserModel = require('../models/user')
const constants = require('../config/constants');

const { status } = require('../config/statuscode')

var { AppController } = require('./appController');


class UserController extends AppController {
    constructor() {
        super();
    }

    signup = (req, res, next) => {
        const { body } = req;
    
        const userSignupSchema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().min(3).max(20).required()
        });
        const { error, value } = userSignupSchema.validate(body);
    
        if (error) {
            return res.status(status.internal_server_error_code).json({
                message: error.message,
            })
        } else {
    
            UserModel.findOne({ email: body.email })
                .exec()
                .then((user) => {
                    if (user) {
                        return res.status(status.conflict_code).json({
                            message: "This email is already registered please use another one."
                        })
                    } else {
                        bcrypt.hash(body.password, 10, function (err, hash) {
                            if (err) {
                                console.log("🚀 ~ file: userController.js ~ line 42 ~ UserController ~ err", err)
                                return res.status(status.internal_server_error_code).json({
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
                                        return res.status(status.created_code).json({
                                            message: "User registered sucessfully.",
                                            data: result
                                        })
                                    })
                                    .catch((err) => {
                                        console.log("🚀 ~ file: userController.js ~ line 60 ~ UserController ~ err", err)
                                        return res.status(status.internal_server_error_code).json({
                                            message: err.message
                                        })
                                    });
                            }
                        });
                    }
                })
                .catch((err) => {
                    console.log("🚀 ~ file: userController.js ~ line 70 ~ UserController ~ err", err)
                    return res.status(status.internal_server_error_code).json({
                        message: err.message
                    })
                })
        }
    }

    login = (req, res, next) => {
        const { body } = req;
    
        const userLoginSchema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().required()
        });
        const { error, value } = userLoginSchema.validate(body);
    
        if (error) {
            return res.status(status.internal_server_error_code).json({
                message: error.message,
            })
        } else {
    
            UserModel.findOne({ email: body.email })
                .select('_id email password')
                .exec()
                .then((user) => {
                    if (user) {
    
                        bcrypt.compare(body.password, user.password, async (err, isMatch) => {
                            if (err) {
                                return res.status(status.unauthorized_code).json({
                                    message: "Auth failed."
                                })
                            } else if (isMatch) {
    
                                var token = jwt.sign({ 
                                    email: user.email,
                                    userId: user.id
                                }, constants.JWT_KEY, {
                                    expiresIn: "1h",
                                });
    
                                user = JSON.parse(JSON.stringify(user));
                                user.token = token
                                delete user.password
                                
                                return res.status(status.success_code).json({
                                    message: "User logged in sucessfully.",
                                    data: user
                                })
                            }else{
                                return res.status(status.unauthorized_code).json({
                                    message: "Auth failed."
                                })
                            }
                        })
                    } else {
                        return res.status(status.unauthorized_code).json({
                            message: "Auth failed."
                        })
                    }
                })
                .catch((err) => {
                    console.log("🚀 ~ file: userController.js ~ line 134 ~ UserController ~ err", err)
                    return res.status(status.internal_server_error_code).json({
                        message: err.message
                    })
                })
        }
    }

    deleteUser = (req, res, next) => {
        const id = req.query.userId
    
        UserModel.findById(id)
            .exec()
            .then((result) => {
                if (result) {
                    UserModel.deleteOne({ _id: id })
                        .exec()
                        .then((result) => {
                            return res.status(status.success_code).json({
                                message: "User deleted sucessfully!",
                                data: result
                            })
                        })
                        .catch((err) => {
                            console.log("🚀 ~ file: userController.js ~ line 158 ~ UserController ~ .then ~ err", err)
                            return res.status(status.internal_server_error_code).json({
                                message: err.message
                            })
                        })
                } else {
                    return res.status(status.not_found_code).json({
                        message: "No user available for given userId"
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: userController.js ~ line 170 ~ UserController ~ deleteUser ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

}
module.exports = new UserController();

