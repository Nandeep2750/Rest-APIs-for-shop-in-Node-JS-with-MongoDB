var ordersRouter = require("./orders");
var productsRouter = require("./products");
var userRouter = require("./user");
const { status } = require('../config/statuscode')


module.exports = app => {
    app.use("/orders", ordersRouter);
    app.use("/products", productsRouter);
    app.use("/user", userRouter);

    app.use((req, res, next) => {
        const error = new Error('Not found')
        error.status = status.not_found_code
        next(error)
    })

    app.use((error, req, res, next) => {
        res.status(error.status || status.internal_server_error_code)
        res.json({
            message: error.message,
        })
    })
}



