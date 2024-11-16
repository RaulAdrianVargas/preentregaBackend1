import fs from "fs";

class ProductManager{
    #products;
    #path;
    static idProduct = 0;

    constructor(){
        this.#path = ("./src/data/products.json")
        this.#products = this.#readProductInfile();
    };

    #asignId(){
        let id = 1;
        if(this.#products.length != 0){
            id = this.#products[this.#products.length -1].id + 1;
        }
        return id;
    }

    //Es un metodo para obtener los productos. Es privada porque solo va a ser utilizada en mi clase.
    #readProductInfile(){
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
            fs.writeFileSync(this.#path, JSON.stringify(this.#products))
        }
        catch(error){
            console.log(`Ocurrio un error al guardar el archivo de productos, ${error}`)
        }
    };

    addProduct(title,description,price,code,stock,category,status = true,thumbnails = []){
        if(!title || !description || !price || !code || !stock || !category){
            return "Todos los parametros son requeridos [title,description,price,code,stock,category]"
        }

        const codigoRepetido = this.#products.some(p => p.code == code);
        if (codigoRepetido)
            return `El codigo ${code} ya se encuentra registrado en otro producto `;

        ProductManager.idProduct = ProductManager.idProduct + 1

        const id = this.#asignId();
        const newProduct =  {
            id: id,
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        };
        this.#products.push(newProduct);
        this.#saveFile();

        return "Producto agregado"
        };


    getProducts(){
        return this.#products;
    }

    getProductById(id){
        let status = false;
        let resp = `El producto con el id ${id} no existe`

       const product = this.#products.find(p => p.id == id);
       if(product){
        status = true;
        resp = product;
       }
      return {status, resp};
    }

    updateProduct(id, productProperties){
        let msg = `El producto con el id: ${id} no existe`;

        const index = this.#products.findIndex(p => p.id === id);

        if(index !== -1){
            const {id, ...rest} = productProperties;
            this.#products[index] = {...this.#products[index], ...rest};
            this.#saveFile();
            msg = "Producto actualizado";
        };

        return msg;
    }

    deleteProduct(id){
        let msg = "Este id no coincide con ningun producto"
        const index = this.#products.findIndex(p => p.id === id);
        if(index !== -1){
            this.#products = this.#products.filter(p => p.id !== id)
            this.#saveFile();
            msg = "Producto eliminado"
        }
        return msg;

    }

}

// module.exports = ProductManager;
export default ProductManager;