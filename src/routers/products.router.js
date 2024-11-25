import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

router.get("/", (req, res) =>{
    const producto = new ProductManager();
    const products = producto.getProducts();
    return res.json({products:products});
});

router.get('/:pid', (req, res)=>{
    const {pid} = req.params;
    const producto = new ProductManager();;
    const product = producto.getProductById(Number(pid));
    return res.json({product});
});

router.post("/",(req, res)=>{
    const {title, description, price, thumbnails, code, stock, category, status} = req.body;
    const producto = new ProductManager();
    const result = producto.addProduct({title, description, price, thumbnails, code, stock, category, status});
    return res.json({result});
});

router.put("/:pid", (req, res)=>{
    const {pid} = req.params;
    const producto = new ProductManager();
    const result = producto.updateProduct(Number(pid), req.body);
    return res.json({result});
})

router.delete("/:pid", (req, res)=>{
    const {pid} = req.params;
    const producto = new ProductManager();
    const result = producto.deleteProduct(Number(pid))
    return res.json({result});
})


export default router;