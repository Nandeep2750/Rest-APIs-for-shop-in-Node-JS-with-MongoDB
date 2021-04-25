const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const multer = require('multer')
const ProductModel = require('../models/product')
const generalHelper = require('../helper/generalhelper');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/products')
    },
    filename:function(req, file, cb) {
        cb(null, generalHelper.generateRandomFileName('product') + '_' +file.originalname )
    },
})

const fileFilter = (req, file, cb) => {
    var validFiletype = ["image/jpg", "image/png", 'image/jpeg'];
    if(validFiletype.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new Error("Uploaded file is not a valid image. Only JPG, JPEG and PNG files are allowed!"), false)
    }
} 

const upload = multer({storage : storage, 
    limits:{
        fieldSize: 1024
    },
    fileFilter: fileFilter
})

router.get('/', (req, res, next) => {

    ProductModel.find()
        .select('_id name price productImage')
        .exec()
        .then((result) => {
            if (result) {
                let response = {
                    count: result.length,
                    products : result
                }

                return res.status(200).json({
                    message: "sucessfully find all products.",
                    data: response
                })
            } else {
                return res.status(404).json({
                    message: "Product not available."
                })
            }
        })
        .catch((err) => {
            console.log("🚀 ~ file: products.js ~ line 58 ~ router.get ~ err", err)
            return res.status(500).json({
                message: err.message
            })
        })
})

router.post('/create', upload.single('productImage') ,(req, res, next) => {
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

            return res.status(201).json({
                message: "Product has been sucessfully created.",
                data: response
            })
        })
        .catch((err) => {
            console.log("🚀 ~ file: products.js ~ line 25 ~ product.save ~ err", err)
            return res.status(500).json({
                message: err.message
            })
        });

})


router.get('/details-by-id', (req, res, next) => {
    const id = req.query.productId

    ProductModel.findById(id)
        .select('_id name price productImage')
        .exec()
        .then((result) => {
            if (result) {
                return res.status(200).json({
                    message: "sucessfully find your product",
                    data: result
                })
            } else {
                return res.status(404).json({
                    message: "No data found for given productId"
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

router.patch('/update', (req, res, next) => {
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
                        return res.status(200).json({
                            message: "Product updated sucessfully!",
                            // data: result
                        })
                    })
                    .catch((err) => {
                        console.log("🚀 ~ file: products.js ~ line 99 ~ router.patch ~ err", err)
                        return res.status(500).json({
                            message: err.message
                        })
                    })
            } else {
                return res.status(404).json({
                    message: "No data found for given productId"
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
    const id = req.query.productId

    ProductModel.findById(id)
        .exec()
        .then((result) => {
            if (result) {
                ProductModel.deleteOne({ _id: id })
                    .exec()
                    .then((result) => {
                        return res.status(200).json({
                            message: "Product deleted sucessfully!",
                            data: result
                        })
                    })
                    .catch((err) => {
                        console.log("🚀 ~ file: products.js ~ line 100 ~ router.delete ~ err", err)
                        return res.status(500).json({
                            message: err.message
                        })
                    })
            } else {
                return res.status(404).json({
                    message: "No data found for given productId"
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

router.delete('/deleteAllProducts', (req, res, next) => {

    ProductModel.remove()
        .exec()
        .then((result) => {
            return res.status(200).json({
                message: "All Products deleted sucessfully!",
                data: result
            })
        })
        .catch((err) => {
            console.log("🚀 ~ file: products.js ~ line 205 ~ router.delete ~ err", err)
            return res.status(500).json({
                message: err.message
            })
        })
})

module.exports = router