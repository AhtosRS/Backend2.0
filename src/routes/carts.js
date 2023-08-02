const { json } = require('body-parser');
const { Router } = require('express');
const carrito = Router();
const fs = require('fs');

carrito.post('/', (req,res) => {
    console.log("post request recibido")
    let prods = req.body;
    res.send(carrosFile.createNewCarro(prods));
})

carrito.get('/:id', (req,res) => {
    let prodId = req.params.id;
    console.log('getid request recibido')
    res.send(carrosFile.showProducts(prodId));
})

carrito.post('/:cid/product/:pid', (req,res) => {
    console.log("post request recibido")
    let cid = req.params.cid;
    let pid = req.params.pid;
    let body = req.body;
    res.send(carrosFile.editProdbyIDs(cid,pid,body));
})


class ContenedorCarros {
    constructor(data){
        this.data = data;
    }

    editProdbyIDs(cid,pid,body) {
        let carros = fs.readFileSync('./public/carritos.json', 'utf-8');
        carros = JSON.parse(carros);
        cid = parseInt(cid);
        pid = parseInt(pid);
        let carroElegido = carros.find(carro => carro.id === cid);
        let prodElegido = carroElegido.products.find(prod => prod.id === pid);

        if (!carroElegido) {
            throw new Error((`El producto con el ID ${cid} no existe.`));
        } 
        if (!prodElegido) {
            throw new Error((`El producto con el ID ${pid} no existe.`));
        } 
        //prodElegido = body;
        let indice = carroElegido.products.findIndex(prod => prod.id === pid)
        if(indice !== -1){
            carroElegido.products[indice] = body;
        }

        let indice2 = carros.findIndex(carro => carro.id === cid);
        if(indice2 !== -1){
            carros[indice2] = carroElegido;
        }

        carros = JSON.stringify(carros);
        fs.writeFileSync('./public/carritos.json', carros, 'utf-8');
        console.log("producto actualizado con exito");
    }

    createNewCarro(products) {
        let carros = fs.readFileSync('./public/carritos.json', 'utf-8');
        carros = JSON.parse(carros);

        const lastId = carros.length > 0 ? carros[carros.length - 1].id : 0;
        const newCarro = {
            id: lastId + 1,
            products: products
        };
        carros.push(newCarro);
        this.saveCarros(carros);
    }

    saveCarros(carros){
        fs.writeFileSync('./public/carritos.json', JSON.stringify(carros), 'utf-8');
    }

    showProducts(id) {
        let carros = fs.readFileSync('./public/carritos.json', 'utf-8');
        carros = JSON.parse(carros);
        id = parseInt(id);
        let filtrado = carros.find(carro => carro.id ===id);
        if (!filtrado) {
            throw new Error((`El producto con el ID ${id} no existe.`));
            }
      
        return filtrado.products;
    }

    //editCarro(cid, pid, productoNew){
    //    let carros = fs.readFileSync('../public/carritos.json', 'utf-8');
    //    let cartFiltrado = carros.find(carro => carro.id === cid);
    //    if (!cartFiltrado) {
    //        throw new Error((`El producto con el ID ${id} no existe.`));
    //        }
    //    let cartprods = cartFiltrado.products.find(prods => prods.id === pid);
    //    if (!cartprods) {
    //        cartFiltrado.products.push(productoNew)
    //    }
    //    else {
    //        
    //    }
    //}
}

let carrosFile = new ContenedorCarros("carros");

module.exports = carrito;