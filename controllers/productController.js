const mongoose = require('mongoose')
var { AppController } = require('./appController');

const ProductModel = require('../models/product')
const { status } = require('../config/statuscode')

class ProductController extends AppController {
    constructor() {
        super();
    }

    getAllProducts = (req, res, next) => {
        ProductModel.find()
            .select('_id name price productImage')
            .exec()
            .then((result) => {
                if (result) {
                    let response = {
                        count: result.length,
                        products: result
                    }

                    return res.status(status.success_code).json({
                        message: "sucessfully find all products.",
                        data: response
                    })
                } else {
                    return res.status(status.not_found_code).json({
                        message: "Product not available."
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: productController.js ~ line 33 ~ ProductController ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

    createNewProduct = (req, res, next) => {
        const product = new ProductModel({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
            // productImage: req.file.filename,
        })

        product.save()
            .then((result) => {
                delete result.__v
                let response = result

                return res.status(status.created_code).json({
                    message: "Product has been sucessfully created.",
                    data: response
                })
            })
            .catch((err) => {
                console.log("🚀 ~ file: productController.js ~ line 60 ~ ProductController ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            });

    }

    getProductDetailsById = (req, res, next) => {
        const id = req.query.productId

        ProductModel.findById(id)
            .select('_id name price productImage')
            .exec()
            .then((result) => {
                if (result) {
                    return res.status(status.success_code).json({
                        message: "sucessfully find your product",
                        data: result
                    })
                } else {
                    return res.status(status.not_found_code).json({
                        message: "No data found for given productId"
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: productController.js ~ line 87 ~ ProductController ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

    updateProduct = (req, res, next) => {
        const id = req.body.productId

        ProductModel.findById(id)
            .exec()
            .then((result) => {
                if (result) {
                    ProductModel.updateOne({ _id: id }, {
                        $set: {
                            name: req.body.name,
                            price: req.body.price
                        }
                    })
                        .exec()
                        .then((result) => {
                            return res.status(status.success_code).json({
                                message: "Product updated sucessfully!",
                                // data: result
                            })
                        })
                        .catch((err) => {
                            console.log("🚀 ~ file: productController.js ~ line 115 ~ ProductController ~ .then ~ err", err)
                            return res.status(status.internal_server_error_code).json({
                                message: err.message
                            })
                        })
                } else {
                    return res.status(status.not_found_code).json({
                        message: "No data found for given productId"
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: productController.js ~ line 127 ~ ProductController ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })

    }

    deleteProductById = (req, res, next) => {
        const id = req.query.productId

        ProductModel.findById(id)
            .exec()
            .then((result) => {
                if (result) {
                    ProductModel.deleteOne({ _id: id })
                        .exec()
                        .then((result) => {
                            return res.status(status.success_code).json({
                                message: "Product deleted sucessfully!",
                                data: result
                            })
                        })
                        .catch((err) => {
                            console.log("🚀 ~ file: productController.js ~ line 151 ~ ProductController ~ .then ~ err", err)
                            return res.status(status.internal_server_error_code).json({
                                message: err.message
                            })
                        })
                } else {
                    return res.status(status.not_found_code).json({
                        message: "No data found for given productId"
                    })
                }
            })
            .catch((err) => {
                console.log("🚀 ~ file: productController.js ~ line 163 ~ ProductController ~ deleteProductById ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

    deleteAllProducts = (req, res, next) => {

        ProductModel.remove()
            .exec()
            .then((result) => {
                return res.status(status.success_code).json({
                    message: "All Products deleted sucessfully!",
                    data: result
                })
            })
            .catch((err) => {
                console.log("🚀 ~ file: productController.js ~ line 181 ~ ProductController ~ deleteAllProducts ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
    }

}

module.exports = new ProductController();