const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        email: { type: String, required: true },
        password: { type: String, required: true }
    },
    { 
        timestamps: true,
        versionKey: false,
    }
)

module.exports = mongoose.model('tbl_user', userSchema)