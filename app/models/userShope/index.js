const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
    shopType: {
        type: String,
        required: [true, "Please Provide shopType"],
    },
    shopId: {
        type: String,
        required: [true, "Please Provide shopId"],
    },
    shopToken: {
        type: String,
        required: [true, "Please Provide shopToken"],
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true
    },
    storeName: {
        type: String,
        require: true
    },
    region: {
        type: String,
        require: true
    },
    timezone: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});


module.exports = mongoose.model("Shop", ShopSchema);
