const jwt = require('jsonwebtoken')
var { JWT_KEY } = require('../config/constants')
var { status } = require('../config/statuscode')

module.exports = async function (req, res, next) {

    var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['token'];

    if (token) {
        try {
            var decoded = jwt.verify(token, JWT_KEY);
            req.userData = decoded
            next();
        } catch (err) {
            console.log("🚀 ~ file: check-auth.js ~ line 17 ~ err", err)
            return res.status(status.unauthorized_code).json({
                message: "Oops! Auth failed."
            })
        }
    } else {
        return res.status(status.unauthorized_code).json({
            message: "Oops! Something went wrong."
        })
    }
};