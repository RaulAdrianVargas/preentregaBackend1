import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import __dirname from "./utils.js";
import views from './routers/views.router.js';
import { dbConnection } from "./database/config.js";
import { productModel } from "./models/products.js";

// Crear el motor de plantillas y agregar helpers
const hbs = engine({
    helpers: {
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        eq: (a, b) => a === b,
        add: (a, b) => a + b,
        subtract: (a, b) => a - b,
        range: (start, end) => {
            let rangeArr = [];
            for (let i = start; i <= end; i++) {
                rangeArr.push(i);
            }
            return rangeArr;
        }
    }
});

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

await dbConnection();

app.engine('handlebars', hbs);  // Usar hbs con los helpers
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', views);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const expressServer = app.listen(PORT, () => {
    console.log(`Corriendo app en el puerto ${PORT}`);
});

const io = new Server(expressServer);

io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    const productos = await productModel.find();
    socket.emit('productos', productos);

    socket.on('agregarProducto', async (producto) => {
        try {
            const productoExistente = await productModel.findOne({ code: producto.code });

            if (productoExistente) {
                socket.emit('error', `El código "${producto.code}" ya está en uso. Por favor, utiliza uno diferente.`);
                return;
            }

            const newProduct = await productModel.create(producto);

            const productosActualizados = await productModel.find();
            io.emit('productos', productosActualizados);

        } catch (error) {
            console.log('Error al agregar producto:', error);
            socket.emit('error', 'Ocurrió un error al agregar el producto.');
        }
    });
});
