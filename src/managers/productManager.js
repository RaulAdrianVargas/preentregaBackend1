import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del directorio actual (emulando __dirname)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ProductManager {
    #products;
    #path;
    static idProduct = 0;

    constructor() {
        // Usando path.join para construir la ruta absoluta del archivo JSON
        this.#path = path.join(__dirname, "../data/productos.json");

        // Lee los productos del archivo
        this.#products = this.#leerProducts() || [];  // Asegura que #products siempre sea un array

        // Define el ID inicial a partir del último ID registrado
        ProductManager.idProduct = this.#products.length
            ? Math.max(...this.#products.map(p => p.id))
            : 0;  
    }

    #leerProducts() {
        try {
            if (fs.existsSync(this.#path)) {
                const data = fs.readFileSync(this.#path, "utf-8");
                return JSON.parse(data);
            }
            return [];  // Si no existe el archivo, devuelve un array vacío
        } catch (error) {
            console.log(`Ocurrió un error al leer el archivo de productos: ${error}`);
            return [];  // Devuelve un array vacío en caso de error
        }
    }

    #saveFile() {
        try {
            fs.writeFileSync(this.#path, JSON.stringify(this.#products, null, 2));  // Añade espacios para mejorar legibilidad
        } catch (error) {
            console.log(`Ocurrió un error al guardar el archivo de productos: ${error}`);
        }
    }

    addProduct(title, description, price, code, stock, category, status=true, thumbnail=[]) {
        let result = "Ocurrió un error";
    
        if (!title || !description || !price || !code || !stock || !category) {
            result = 'Todos los parámetros son requeridos [title, description, price, code, stock, category]';
        } else {
            const codigoRepetido = this.#products.some(p => String(p.code).trim() === String(code).trim());
            if (codigoRepetido) {
                result = `El código ${code} ya está registrado en otro producto.`;
            } else {
                const lastId = this.#products.length ? Math.max(...this.#products.map(p => p.id)) : 0;
                const newId = lastId + 1;
                const idRepetido = this.#products.some(p => p.id === newId);
                if (idRepetido) {
                    result = `El ID ${newId} ya está registrado en otro producto.`;
                } else {
                    const newProduct = {
                        id: newId,
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        category,
                        status
                    };

                    this.#products.push(newProduct);
                    this.#saveFile();

                    result = {
                        msg: "Producto agregado exitosamente",
                        product: newProduct
                    };
                }
            }
        }
        return result;
    }

    getProducts() {
        return this.#products;
    }

    getProductsById(id) {
        const product = this.#products.find(p => p.id === id);
        return product || `No se encontró el producto con el ID ${id}`;
    }

    updateProduct(id, objectUpdate) {
        const index = this.#products.findIndex(p => p.id === id);

        if (index === -1) {
            return `El producto con ID ${id} no existe.`;
        }

        const { id: idToUpdate, ...rest } = objectUpdate;
        this.#products[index] = { ...this.#products[index], ...rest };
        this.#saveFile();
        return "Producto actualizado";
    }

    deleteProduct(id) {
        const index = this.#products.findIndex(p => p.id === id);

        if (index === -1) {
            return `El producto con el ID ${id} no existe.`;
        }

        this.#products = this.#products.filter(p => p.id !== id);
        this.#saveFile();
        return "Producto eliminado!";
    }
}

export default ProductManager;
