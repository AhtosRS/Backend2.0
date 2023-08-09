const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const manager = new ProductManager('productos.json');

router.get('/', async(req, res) => {
    const products = await manager.getProducts();
        res.render("home", {title: "Productos" ,products});
});

router.get('/realTimeProducts', async (req, res) => {
    const products = await manager.getProducts();
    res.render('realTimeProducts', { title: 'Productos en tiempo real', products });
  });
  
module.exports = router;