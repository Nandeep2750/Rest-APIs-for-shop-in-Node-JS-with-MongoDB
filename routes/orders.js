const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth');

const orderController = require('../controllers/orderController')

router.get('/', checkAuth, orderController.getAllOrders)
router.post('/create', checkAuth, orderController.createNewOrder)
router.get('/details-by-id', checkAuth, orderController.getOrderDetailsById )
router.delete('/delete', checkAuth, orderController.deleteOrderById)
router.delete('/deleteAllOrders', checkAuth, orderController.deleteAllOrders )

module.exports = router