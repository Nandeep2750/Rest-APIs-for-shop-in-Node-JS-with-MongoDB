var ordersRouter = require("./orders");
var productsRouter = require("./products");
var userRouter = require("./user");

module.exports = app => {
    app.use("/orders", ordersRouter);
    app.use("/products", productsRouter);
    app.use("/user", userRouter);

    app.use((req, res, next) => {
        const error = new Error('Not found')
        error.status = 404
        next(error)
    })

    app.use((error, req, res, next) => {
        res.status(error.status || 500)
        res.json({
            message: error.message,
        })
    })
}



