const express = require('express');
const ProductManager = require('../ProductManager');
const productRouter = express.Router();
const productManager = new ProductManager('productos.json');
// const { EventEmitter } = require('events');
// const emitter = new EventEmitter();
// const manager = new ProductManager();
// const addProduct = require('../ProductManager');
// const deleteProduct = require('../ProductManager');


productRouter.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts();
    if (limit !== undefined) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

productRouter.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(parseInt(productId));
    res.json(product);
});

productRouter.post('/', async (req, res) => {
    let { title, description, code, price, status, stock, category } = req.body
    checkearCampoRequerido(title, "title", res)
    checkearCampoRequerido(description, "description", res)
    checkearCampoRequerido(code, "code", res)
    checkearCampoRequerido(price, "price", res)
    status = status || true
    checkearCampoRequerido(status, "status", res)
    checkearCampoRequerido(stock, "stock", res)
    checkearCampoRequerido(category, "category", res)
    const newProduct = await productManager.addProduct(req.body);
    return res.status(200).json({
        success: true,
        product: newProduct
    });
});

productRouter.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    await productManager.updateProduct(productId, req.body);
    res.json({ message: 'Producto actualizado' });
});

productRouter.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    await productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado' });
});

function checkearCampoRequerido(property, propertyDescription, response) {
    if (!property) {
        return response.status(400).json({
            success: false,
            message: `${propertyDescription} es un campo requerido.`
        });
    }
}

// productRouter.post("/", async (req, res) => {
//     addProduct();
//     emitter.emit('productAdded', newProduct);
//     res.status(201).json({ message: 'Producto agregado correctamente', productId: newProduct.id });
// });

// productRouter.delete("/:pid", async (req, res) => {
//     const productId = req.params.pid;
//     deleteProduct();
//     emitter.emit('productDeleted', productId);
//     res.json({ message: 'Producto eliminado correctamente' });
// });


module.exports = productRouter;