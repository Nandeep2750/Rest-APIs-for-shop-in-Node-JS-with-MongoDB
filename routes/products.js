const express = require('express')
const router = express.Router()
const multer = require('multer')
const generalHelper = require('../helper/generalhelper');
const checkAuth = require('../middleware/check-auth');

const productController = require('../controllers/productController')

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

router.get('/', productController.getAllProducts)
router.post('/create', checkAuth, upload.single('productImage') , productController.createNewProduct)
router.get('/details-by-id', checkAuth,  productController.getProductDetailsById)
router.patch('/update', checkAuth, productController.updateProduct )
router.delete('/delete', checkAuth, productController.deleteProductById)
router.delete('/deleteAllProducts', checkAuth, productController.deleteAllProducts )

module.exports = router