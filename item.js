const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({ name: String, price: Number });

module.exports = mongoose.model("dish", ItemSchema);
