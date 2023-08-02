const { Router } = require('express');
const productos = Router();
const fs = require('fs');

productos.get('/', (req,res) => {
    console.log("get request recibido")
    let limite = req.query.limit;
    let todos = productosFile.getProductos();
    todos = todos.slice(0, limite);
    res.send(todos);
})

productos.get('/:id', (req,res) => {
    console.log("request de id recibido")
    let pid = req.params.id;
    res.send(productosFile.getProdByID(pid));
})

productos.post('/', (req, res) => {
    console.log("intentando ingresar nuevo producto");
    let nuevo = req.body;
    res.send(productosFile.createNewProduct(nuevo));
})

productos.put('/:pid', (req,res)=> {
    console.log("intentando actualizar producto");
    let pid = req.params.pid;
    let newProd = req.body;
    res.send(productosFile.updateProduct(pid, newProd));
})

productos.delete('/:pid', (req,res)=> {
    console.log("intentando eliminar producto");
    let pid = req.params.pid;
    res.send(productosFile.deleteProduct(pid));
})

class ContenedorProductos {
    constructor(data){
        this.data = data;
    }

    deleteProduct(pid){
        let products = fs.readFileSync('./public/productos.json', 'utf-8');
        products = JSON.parse(products);
        pid = parseInt(pid);
        products = products.filter(prod => prod.id !== pid);
        let aEliminar = products.find(prod => prod.id === pid);

        if (!aEliminar) {
            throw new Error((`El producto con el ID ${pid} no existe.`));
        } 
        
        products = JSON.stringify(products);
        fs.writeFileSync('./public/productos.json', products, 'utf-8');
        console.log("producto eliminado con exito");
    }

    updateProduct(pid, newProd){
        let products = fs.readFileSync('./public/productos.json', 'utf-8');
        products = JSON.parse(products);
        pid = parseInt(pid);
        let toUpdate = products.find(prod => prod.id === pid)
        let indice = products.findIndex(prod => prod.id === pid)

        if (!this.ProductoValidoTester(newProd)) {      
            console.log('Error: Producto invalido');
            return;
          }
        
        if (this.ProductoDuplicado(newProd.code)) {  
          console.log('Error: Producto ya existe en base de datos');
          return;
        }

        toUpdate = {
          id: pid,  
          title: newProd.title, 
          description: newProd.description,
          code: newProd.code,
          price: newProd.price,
          status: newProd.status,
          stock: newProd.stock,
          category: newProd.category,
          thumbnail: newProd.thumbnail 
        }

        if(indice !== -1){
            products[indice] = toUpdate;
        }
        products = JSON.stringify(products);
        fs.writeFileSync('./public/productos.json', products, 'utf-8');
        console.log("producto actualizado con exito");
    }

    createNewProduct(nuevo){
        let products = fs.readFileSync('./public/productos.json', 'utf-8');
        products = JSON.parse(products);
        const lastId = products.length > 0 ? products[products.length - 1].id : 0;
        
        if (!this.ProductoValidoTester(nuevo)) {      
            console.log('Error: Producto invalido');
            return;
          }

        if (this.ProductoDuplicado(nuevo.code)) {  
            console.log('Error: Producto duplicado');
            return;
          }

        let newProduct = {
          id: lastId + 1,  
          title: nuevo.title, 
          description: nuevo.description,
          code: nuevo.code,
          price: nuevo.price,
          status: nuevo.status,
          stock: nuevo.stock,
          category: nuevo.category,
          thumbnail: nuevo.thumbnail  
        };

        products.push(newProduct);
        products = JSON.stringify(products);
        fs.writeFileSync('./public/productos.json', products, 'utf-8');
        console.log("producto aniadido con exito");
    }

    ProductoValidoTester(product) {
        return (
            product.title &&
            product.description &&
            product.code &&
            product.price &&
            product.status &&
            product.stock &&
            product.category 
          );
    }

    ProductoDuplicado(code) {        
        const productsArray = this.getProductos();
        return productsArray.some(product => product.code === code);
    }

    getProductos() {
        let products = fs.readFileSync('./public/productos.json', 'utf-8');
        products = JSON.parse(products);

        if (products.length === 0){
            console.log("vacio")
        }
        return products;
    }

    getProdByID(pid) {
        let products = fs.readFileSync('./public/productos.json', 'utf-8');
        products = JSON.parse(products);
        pid = parseInt(pid);
        let filtrado = products.find(prod => prod.id === pid);
        if (!filtrado) {
            throw new Error((`El producto con el ID ${pid} no existe.`));
        } 
        return filtrado;
    }

}

let productosFile = new ContenedorProductos("productos");

module.exports = productos;