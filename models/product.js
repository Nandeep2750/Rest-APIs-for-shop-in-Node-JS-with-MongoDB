const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        price: { type: Number, required: true },
        productImage: { type: String, required: true }
    },
    { 
        timestamps: true,
        versionKey: false,
    }
)

module.exports = mongoose.model('tbl_product', productSchema)