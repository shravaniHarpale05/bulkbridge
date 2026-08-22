const mongoose = require("mongoose");

const produceSchema = new mongoose.Schema({

    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    availableUntil: {
        type: String,
        required: true
    }

});

const Produce = mongoose.model("Produce", produceSchema);

module.exports = Produce;