const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
  image: {
    type: String, // could be a URL or image path
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
