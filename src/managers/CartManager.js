import fs from "fs";
import ProductManager from "./ProductManager.js";

class CartManager{
    #carts;
    #path;
    static idCart = 0;

    constructor(){
        this.#path = ("./src/data/carts.json")
        this.#carts = this.#readcartInfile();
    };

    #asignId(){
        let id = 1;
        if(this.#carts.length != 0){
            id = this.#carts[this.#carts.length -1].id + 1;
        }
        return id;
    }
    // #asignId() {
    //     const ids = this.#carts.map(product => product.id);
    //     let id = 1;
    //     while (ids.includes(id)) {
    //         id++;
    //     }
    //     return id;
    // }
    //Revisar este codigo para ver si funciona

    #readcartInfile(){
        try {
            if(fs.existsSync(this.#path)){
                return JSON.parse(fs.readFileSync(this.#path, "utf-8"))
            };
            return [];
        } catch (error) {
            console.log(`Ocurrio un error al leer el archivo ${error}`)
            return [];
        }
    }
    #saveFile(){
        try{
            fs.writeFileSync(this.#path, JSON.stringify(this.#carts))
        }
        catch(error){
            console.log(`Ocurrio un error al guardar el archivo de cartos, ${error}`)
        }
    };

    createCart(){
        const newCart = {
            id: this.#asignId(),
            products: [ ]
        };

        this.#carts.push(newCart);
        this.#saveFile();
        return newCart;
    }

    getcartById(id){
       const cart = this.#carts.find(producto => producto.id == id);
       if(cart){
        return cart
       }
       else return `No hay cart con el id ${id}`
    }

    addProductInCart(cid, pid) {
        let result = `El carrito con id ${cid} no existe`;
        const indexCart = this.#carts.findIndex(c => c.id == cid);
    
        if (indexCart !== -1) {
            const indexProductoCart = this.#carts[indexCart].products.findIndex(producto => producto.id == pid);
            const productManager = new ProductManager();
            const product = productManager.getProductById(pid);
    
            if (product.status && indexProductoCart === -1) {
                // Agregar producto nuevo al carrito
                this.#carts[indexCart].products.push({ id: pid, cuantity: 1 });
                this.#saveFile();
                result = "Producto agregado con éxito";
            } else if (product.status && indexProductoCart !== -1) {
                // Incrementar cantidad del producto en el carrito
                ++this.#carts[indexCart].products[indexProductoCart].cuantity;
                this.#saveFile();
                result = "Producto agregado con éxito";
            } else {
                // Producto no existe en el catálogo
                result = `El producto con id ${pid} no existe`;
            }
        }
    
        return result;
    }
}

export default CartManager;