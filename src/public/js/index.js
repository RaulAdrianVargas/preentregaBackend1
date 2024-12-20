const socket = io();

socket.on('productos', productos => {
    const tBody = document.getElementById('realTimeProducts');
    tBody.innerHTML = '';

    productos.forEach(producto => {
        const row = tBody.insertRow();
        row.innerHTML = `
        <td>${producto._id}</td>
        <td>${producto.title}</td>
        <td>${producto.description}</td>
        <td>${producto.price}</td>
        <td>${producto.code}</td>
        <td>${producto.stock}</td>
        <td>${producto.category}</td>
        <td>${producto.status ? 'Activo' : 'Desactivado'}</td>
        <td>${producto.thumbnail && producto.thumbnail.length > 0 ? producto.thumbnail[0] : 'No hay imagen'}</td>
        `;
    });
});

const formulario = document.getElementById('agregar_producto');

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const producto = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value
    };

    // Validar que los campos obligatorios no estén vacíos
    if (!producto.title || !producto.description || !producto.price || !producto.code || !producto.stock || !producto.category) {
        alert('Todos los campos son obligatorios');
        return;
    }

    socket.emit('agregarProducto', producto);
    formulario.reset();
});
