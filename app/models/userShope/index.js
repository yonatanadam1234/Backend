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
});


module.exports = mongoose.model("Shop", ShopSchema);
