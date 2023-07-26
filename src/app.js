const express = require('express');
const ProductManager = require('./ProductManager');
const app = express()

app.use(express.json());
app.use(express.urlencoded({exteded:true}))

const productManager = new ProductManager('products.json');


app.get('/products', (req, res) => {
    const products = productManager.getProducts();
    let valor = req.query.valor;
    let limitado = products.slice(0, valor);
    res.send(limitado)
})

app.get('/products/:pid', (req, res) => {
    const products = productManager.getProducts();
    let pid = parseInt(req.params.pid);
    let elegido = products.find(obj=>obj.id === pid);
    if (!elegido) return res.send({error: "ID no encontrado"})
    res.send(elegido)
})


app.listen(8080, () => console.log("server up!"))