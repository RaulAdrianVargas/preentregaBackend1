import { Router } from "express";
import { addProductInCart, createCart, deleteAllProductsInCart, deleteProductsInCart, getcartById, updateProductsInCart } from "../controllers/cart.controller.js";



const router = Router();

router.get("/:cid", getcartById);

router.post("/", createCart);

router.post("/:cid/product/:pid", addProductInCart);

router.delete('/:cid/products/:pid',  deleteProductsInCart);

router.put('/:cid/products/:pid', updateProductsInCart )

router.delete('/:cid', deleteAllProductsInCart);

router.get('/carts/:cid', async (req, res) => {
    const cart = await cartService.getCartById(req.params.cid);
    res.render('cart', { cart });
});


export default router;