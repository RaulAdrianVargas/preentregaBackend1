import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

router.get('/', (req, res)=>{
    const producto = new ProductManager();
    const productos = producto.getProducts();
    return res.render('home',{productos, style:'style.css'});
});

router.get('/realtimeproducts', (req, res)=>{
    return res.render('realTimeProducts')
});

export default router;