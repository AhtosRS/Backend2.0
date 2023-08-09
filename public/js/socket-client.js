const socket = io();

socket.on('connect', () => {
  console.log('Conectado al servidor');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});

socket.on('productAdded', (product) => {
  const productListItem = document.createElement('li');
  productListItem.textContent = `${product.title} - ${product.price}`;
  document.getElementById('product-list').appendChild(productListItem);
});

socket.on('productDeleted', (productId) => {
  const productListItem = document.querySelector(`li[data-product-id="${productId}"]`);
  if (productListItem) {
    productListItem.remove();
  }
});
