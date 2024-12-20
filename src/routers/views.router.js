import { Router } from "express";
import { productModel } from "../models/products.js";
import { getProducts } from "../controllers/product.controller.js"; // Opción alternativa

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const productos = await productModel.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        return res.render('home', {
            productos,
            style: 'style.css'
        });
    } catch (error) {
        console.log("Error en router.get('/'): ", error);
        return res.status(500).json({ msg: 'Error al cargar la página principal' });
    }
});

router.get('/realtimeproducts', (req, res) => {
    return res.render('realTimeProducts');
});

export default router;
