const express = require('express');
const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');
const homeRouter = require('./routes/views.routes');
const app = express();
const { emitter } = require('./ProductManager');


//Agrego handlebars y socket.io
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const handlebars = require('express-handlebars');
const path = require('path');

app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', homeRouter);
app.use('/realTimeProducts', homeRouter);

// Configure Handlebars view engine
app.engine( "handlebars", handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io configuration
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });

  emitter.on('productAdded', (product) => {
    io.emit('productAdded', product); 
  });

  emitter.on('productDeleted', (productId) => {
    io.emit('productDeleted', productId); 
  });
});

// Your CartManager and routes setup
const CartManager = require('./CartManager');
const cartManager = new CartManager('carrito.json');
const ProductManager = require('./ProductManager');
const productManager = new ProductManager('productos.json');

// Add the CartManager instance to the app.locals to make it accessible in routes
app.locals.cartManager = cartManager;
app.locals.productManager = productManager;

// Start the server
const PORT = 8080;
http.listen(PORT, () => {
  console.log(`El servidor corre en el puerto ${PORT}`);
});
