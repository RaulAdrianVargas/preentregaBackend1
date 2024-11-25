import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import __dirname from "./utils.js";
import views from './routers/views.router.js'
import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;

const producto = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', views)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const expressServer = app.listen(PORT, ()=>
    {console.log(`Corriendo app en el puerto ${PORT}`);
});
const socketServer = new Server(expressServer);

socketServer.on('connection', socket =>{
    
    const productos = producto.getProducts();
    socket.emit('productos', productos);

    socket.on('agregarProducto', nuevoProducto => {
        const result = producto.addProduct(
            nuevoProducto.title,
            nuevoProducto.description,
            nuevoProducto.price,
            nuevoProducto.code,
            nuevoProducto.stock,
            nuevoProducto.category
        );

        console.log(result);
        const productosActualizados = producto.getProducts();
        socket.emit('productos', productosActualizados);
    });
});