const express = require('express');

const routesProductos = require('./routes/products')
const routeCarritos = require('./routes/carts')


const app = express();

app.use(express.json());
app.use(express.urlencoded({exteded:true}))
app.use('/api/products/', routesProductos);
app.use('/api/carts/', routeCarritos);


app.listen(8080, () => console.log("server up!"))



