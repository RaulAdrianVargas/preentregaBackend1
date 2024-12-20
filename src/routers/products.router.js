import { Router } from "express";
import { addProduct, deleteProduct, getProducts, getProductsById, updateProduct } from "../controllers/product.controller.js";


const router = Router();

router.get("/", getProducts)
router.get('/:pid', getProductsById);
router.post("/", addProduct);
router.put("/:pid", updateProduct)
router.delete("/:pid", deleteProduct)
router.get('/products', async (req, res) => {
    const page = req.query.page || 1;
    const { products, hasNextPage, hasPrevPage, prevPage, nextPage } = await productService.getPaginatedProducts(page);
    res.render('index', { productos: products, hasNextPage, hasPrevPage, prevPage, nextPage });
});

router.get('/products/:pid', async (req, res) => {
    const product = await productService.getProductById(req.params.pid);
    res.render('productDetails', { product });
});

export default router;