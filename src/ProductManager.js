const fs = require('fs');

class ProductManager {
    constructor(path) {
    this.path = path;
  }

    getProducts() {                 
      try {
        const data = fs.readFileSync(this.path, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        return [];
      }
    }
  
    addProduct(product) {                        //creo el metodo addProduct para agregar productos
      const products = this.getProducts();
      const lastId = products.length > 0 ? products[products.length - 1].id : 0;

      if (!this.ProductoValido(product)) {      //utilizo el metodo productovalido definido mas abajo para chequear que el producto a agruegar sea valido y no se agruegue cualquier cosa
        console.log('Error: Producto invalido');
        return;
      }
  
      if (this.ProductoDuplicado(product.code)) {  //utilizo este metodo definido mas abajo para chequear que no este duplicado el producto bajo su propiedad "code"
        console.log('Error: Producto duplicado');
        return;
      }
  
      const newProduct = {
        id: lastId + 1,  
        title: product.title, 
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: product.code,
        stock: product.stock
      };
  
      products.push(newProduct); 
      this.saveProducts(products);
    }

    saveProducts(products) {
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf-8');
    }
    
    ProductoValido(product) {          //defino este metodo para que los campos del producto sean obligatorios
      return (
        product.title &&
        product.description &&
        product.price &&
        product.thumbnail &&
        product.code &&
        product.stock
      );
    }
  
    ProductoDuplicado(code) {         //verifico si al menos un elemento de un array contiene un "code" igual
      const productsArray = this.getProducts();
      return productsArray.some(product => product.code === code);
    }
  
    getProductById(id) {     //metodo para mostrar el producto que contenga el id solicitado en su defecto tira que no lo encontro
        const products = this.getProducts();
        const product = products.find(product => product.id === id);
    
        if (!product) {
          throw new Error((`El producto con el ID ${id} no existe.`));
        }
    
        return product;
      }
    
    updateProduct(id, updates){
      const products = this.getProducts();
      const productIndex = products.findIndex(product => product.id === id);

      products[productIndex] = { ...products[productIndex], ...updates };
      
      this.saveProducts(products);
    }

    deleteProduct(id){
      const products = this.getProducts();
      const testExists = this.getProductById(id);
      const productsNonDeleted = products.filter(product => product.id !== id);
      this.saveProducts(productsNonDeleted);
    }

}

//const productManager = new ProductManager('productos.json');

module.exports = ProductManager;