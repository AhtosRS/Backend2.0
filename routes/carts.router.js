const express = require('express');
const CartManager = require('../CartManager');

const cartRouter = express.Router();
const cartManager = new CartManager('carrito.json');

cartRouter.post('/', async (req, res) => {
  const newCartId = await cartManager.createCart();
  res.json( newCartId );
});

cartRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);
  res.json(cart);
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  await cartManager.addProductToCart(cartId, productId, quantity);
  res.json({ message: 'Producto agregado' });
});

module.exports = cartRouter;