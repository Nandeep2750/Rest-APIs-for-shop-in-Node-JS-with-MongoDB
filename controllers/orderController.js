const mongoose = require('mongoose')
var { AppController } = require('./appController');

const { status } = require('../config/statuscode')
const OrderModel = require('../models/order')
const ProductModel = require('../models/product')

class OrderController extends AppController {
    constructor() {
        super();
    }

    getAllOrders = (req, res, next) => {
        OrderModel.find()
            .select('_id productId quantity')
            .populate('productId', 'name price')
            .exec()
            .then((result) => {
                if (result) {
                    let response = {
                        count: result.length,
                        orders: result
                    }

                    return res.status(status.success_code).json({
                        message: "Sucessfully find all orders",
                        data: response
                    })
                } else {
                    return res.status(status.not_found_code).json({
                        message: "Orders not available."
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: orderController.js ~ line 35 ~ OrderController ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

    createNewOrder = (req, res, next) => {

        ProductModel.findById(req.body.productId)
            .exec()
            .then((product) => {
                if (product) {

                    let order = new OrderModel({
                        _id: new mongoose.Types.ObjectId(),
                        productId: req.body.productId,
                        quantity: req.body.quantity
                    })

                    order.save()
                        .then((result) => {
                            return res.status(status.created_code).json({
                                message: "Order has been sucessfully placed.",
                                data: result
                            })
                        })
                        .catch((err) => {
                            console.log("🚀 ~ file: orderController.js ~ line 63 ~ OrderController ~ .then ~ err", err)
                            return res.status(status.internal_server_error_code).json({
                                message: err.message
                            })
                        });

                } else {
                    return res.status(status.not_found_code).json({
                        message: "Product not available for for given productId"
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: orderController.js ~ line 76 ~ OrderController ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

    getOrderDetailsById = (req, res, next) => {
        const id = req.query.orderId
    
        OrderModel.findById(id)
            .select('_id productId quantity')
            .populate('productId','name price')
            .exec()
            .then((result) => {
                if (result) {
                    return res.status(status.success_code).json({
                        message: "sucessfully find your product",
                        data: result
                    })
                } else {
                    return res.status(status.not_found_code).json({
                        message: "No data found for given orderId"
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: orderController.js ~ line 103 ~ OrderController ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

    deleteOrderById = (req, res, next) => {
        const id = req.query.orderId
    
        OrderModel.findById(id)
            .exec()
            .then((result) => {
                if (result) {
                    OrderModel.remove({ _id: id })
                        .exec()
                        .then((result) => {
                            return res.status(status.success_code).json({
                                message: "Order deleted sucessfully!",
                                data: result
                            })
                        })
                        .catch((err) => {
                            console.log("🚀 ~ file: orderController.js ~ line 126 ~ OrderController ~ .then ~ err", err)
                            return res.status(status.internal_server_error_code).json({
                                message: err.message
                            })
                        })
                } else {
                    return res.status(status.not_found_code).json({
                        message: "No data found for given orderId"
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: orderController.js ~ line 138 ~ OrderController ~ deleteOrderById ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

    deleteAllOrders = (req, res, next) => {
        OrderModel.remove()
            .exec()
            .then((result) => {
                return res.status(status.success_code).json({
                    message: "All Orders deleted sucessfully!",
                    data: result
                })
            })
            .catch((err) => {
                console.log("🚀 ~ file: orderController.js ~ line 155 ~ OrderController ~ deleteAllOrders ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

}

module.exports = new OrderController();