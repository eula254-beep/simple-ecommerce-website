const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // check if item already in cart
    let cartItem = await Cart.findOne({ productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({ productId, quantity });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.find().populate('productId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await Cart.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Cart item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove from cart
router.delete('/:id', async (req, res) => {
  try {
    const item = await Cart.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
