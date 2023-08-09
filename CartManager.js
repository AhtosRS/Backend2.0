const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart() {
      const carts = await this.getCarts();
      const lastId = carts.length > 0 ? carts[carts.length - 1].id : 0;  
      const cart = {
            id: lastId + 1,
            products: []
        };
        await this.saveCart(cart);
        return cart;
    }

    async getCartById(cartId) {
      const carts = await this.getCarts();
      const cart = carts.find(c => c.id === parseInt(cartId));
      if (!cart) {
        throw new Error(`El carrito con id ${cartId} no fue encontrado.`);
      }
      return cart;
    }

    async addProductToCart(cartId, productId, quantity) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === parseInt(cartId));
        if (cartIndex !== -1) {
            const cart = carts[cartIndex];
            const existingProductIndex = cart.products.findIndex(p => p.product === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({product: productId, quantity});
            }
            await this.saveCart(cart);
        } else {
            throw new Error(`El carrito con ID ${cartId} no fue encontrado.`);
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveCart(cart) {
        const carts = await this.getCarts();
        const existingCartIndex = carts.findIndex(c => c.id === cart.id);
        if (existingCartIndex !== -1) {
            carts[existingCartIndex] = cart;
        } else {
            carts.push(cart);
        }
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
    }
}

module.exports = CartManager;