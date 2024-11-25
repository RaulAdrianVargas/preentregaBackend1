const socket = io();

socket.on('productos', productos => {
    const tBody = document.getElementById('realTimeProducts');
    tBody.innerHTML = '';

    productos.forEach(producto => {
        const row = tBody.insertRow();

        row.innerHTML = `
        <td>${producto.id}</td>
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

formulario.addEventListener('submit', function (event){
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const codigo = document.getElementById('codigo').value;
    const stock = document.getElementById('stock').value;
    const categoria = document.getElementById('titulo').value;
    
    const producto = {
        title: titulo,
        description: descripcion,
        price: precio,
        code: codigo,
        stock: stock,
        category: categoria
    };

    socket.emit('agregarProducto', producto)
    formulario.reset();
});