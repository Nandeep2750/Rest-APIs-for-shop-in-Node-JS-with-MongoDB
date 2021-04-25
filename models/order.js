const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'tbl_product' },
        quantity: { type: Number, default: 1 }
    },
    { 
        timestamps: true,
        versionKey: false,
    }
)

module.exports = mongoose.model('tbl_order', orderSchema)