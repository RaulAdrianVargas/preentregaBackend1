import {Router} from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();

router.get("/", (req, res)=>{
    const p = new ProductManager();
    return res.json({products: p.getProducts()})
})

router.get('/:pid', (req,res)=>{
    const {pid} = req.params;
    const p = new ProductManager();
    const product = p.getProductsById(Number(pid));
    return res.json({product});
})

router.post("/", (req, res)=>{
    const { title, description, price, thumbnail, code, stock, category, status } = req.body;
    const p = new ProductManager();
    const result = p.addProduct(title, description, price, thumbnail, code, stock, category, status);
    return res.json({ result });
})

router.put("/:pid", (req, res)=>{
    const{pid} = req.params;
    const p = new ProductManager();
    let result = p.updateProduct(Number(pid), req.body)
    return res.json({result})
});

router.delete("/:pid", (req, res)=>{
    return res.json({})
});


export default router;
