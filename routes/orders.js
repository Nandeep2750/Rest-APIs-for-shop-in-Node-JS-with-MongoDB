const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const OrderModel = require('../models/order')
const ProductModel = require('../models/product')

router.get('/', (req, res, next) => {
    OrderModel.find()
        .select('_id productId quantity')
        .populate('productId','name price')
        .exec()
        .then((result) => {
            if (result) {
                let response = {
                    count: result.length,
                    orders: result
                }

                return res.status(200).json({
                    message: "Sucessfully find all orders",
                    data: response
                })
            } else {
                return res.status(404).json({
                    message: "Orders not available."
                })
            }
        })
        .catch((err) => {
            console.log("🚀 ~ file: products.js ~ line 51 ~ router.get ~ err", err)
            return res.status(500).json({
                message: err.message
            })
        })
})

router.post('/create', (req, res, next) => {

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
                        return res.status(201).json({
                            message: "Order has been sucessfully placed.",
                            data: result
                        })
                    })
                    .catch((err) => {
                        console.log("🚀 ~ file: orders.js ~ line 39 ~ router.post ~ err", err)
                        return res.status(500).json({
                            message: err.message
                        })
                    });

            } else {
                return res.status(404).json({
                    message: "Product not available for for given productId"
                })
            }
        })
        .catch((err) => {
            console.log("🚀 ~ file: orders.js ~ line 68 ~ router.post ~ err", err)
            return res.status(500).json({
                message: err.message
            })
        })
})


router.get('/details-by-id', (req, res, next) => {
    const id = req.query.orderId

    OrderModel.findById(id)
        .select('_id productId quantity')
        .populate('productId','name price')
        .exec()
        .then((result) => {
            if (result) {
                return res.status(200).json({
                    message: "sucessfully find your product",
                    data: result
                })
            } else {
                return res.status(404).json({
                    message: "No data found for given orderId"
                })
            }
        })
        .catch((err) => {
            console.log("🚀 ~ file: products.js ~ line 51 ~ router.get ~ err", err)
            return res.status(500).json({
                message: err.message
            })
        })
})

router.delete('/delete', (req, res, next) => {
    const id = req.query.orderId

    OrderModel.findById(id)
        .exec()
        .then((result) => {
            if (result) {
                OrderModel.remove({ _id: id })
                    .exec()
                    .then((result) => {
                        return res.status(200).json({
                            message: "Order deleted sucessfully!",
                            data: result
                        })
                    })
                    .catch((err) => {
                        console.log("🚀 ~ file: orders.js ~ line 145 ~ .then ~ err", err)
                        return res.status(500).json({
                            message: err.message
                        })
                    })
            } else {
                return res.status(404).json({
                    message: "No data found for given orderId"
                })
            }
        })
        .catch((err) => {
            console.log("🚀 ~ file: orders.js ~ line 157 ~ router.delete ~ err", err)
            return res.status(500).json({
                message: err.message
            })
        })
})

router.delete('/deleteAllOrders', (req, res, next) => {
    OrderModel.remove()
        .exec()
        .then((result) => {
            return res.status(200).json({
                message: "All Orders deleted sucessfully!",
                data: result
            })
        })
        .catch((err) => {
            console.log("🚀 ~ file: orders.js ~ line 153 ~ router.delete ~ err", err)
            return res.status(500).json({
                message: err.message
            })
        })
})

module.exports = router