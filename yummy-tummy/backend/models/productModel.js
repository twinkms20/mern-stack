const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  img: String,
});

module.exports = mongoose.model('Products', productSchema);
