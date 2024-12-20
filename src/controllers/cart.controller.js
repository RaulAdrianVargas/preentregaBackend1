import { request, response } from "express";
import { cartModel } from "../models/carts.js";

export const getcartById = async (req = request, res = response) => {
    try {
        const { cid } = req.params;

        const carrito = await cartModel
            .findById(cid)
            .populate('products.product'); 

        if (!carrito) {
            return res.status(404).json({ 
                msg: `El carrito con el id ${cid} no existe` 
            });
        }

        return res.json({ carrito });

    } catch (error) {
        console.log("getcartById -> ", error);
        return res.status(500).json({ msg: "Hablar con un administrador" });
    }
};

export const createCart = async (req= request, res= response) =>{
    try {
        const carrito = await cartModel.create({})
        return res.json({msg: "Carrito creado", carrito})
    } catch (error) {
        console.log("createCart -> ", error);
     return res.status(500).json({msg:"Hablar con un administrador"})
    }
}

export const addProductInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        const carrito = await cartModel.findById(cid);
        
        if (!carrito) {
            return res.status(404).json({ msg: `El carrito con el cid: ${cid} no existe` });
        }

        const productInCart = carrito.products.find(producto => producto.product.toString() === pid);
        
        if (productInCart) {
            productInCart.quantity++;
        } else {
            carrito.products.push({ product: pid, quantity: 1 });
        }
        
        await carrito.save();
        return res.json({ msg: "El carrito se actualizó correctamente", carrito });
    } catch (error) {
        console.log("addProductInCart -> ", error);
        return res.status(500).json({ msg: "Hablar con un administrador" });
    }
};

export const deleteProductsInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;

        const carrito = await cartModel.findById(cid);
        
        if (!carrito) {
            return res.status(404).json({ msg: `El carrito con el id ${cid} no existe` });
        }

        carrito.products = carrito.products.filter(producto => producto.product.toString() !== pid);

        await carrito.save();

        return res.status(200).json({ msg: 'Producto eliminado con éxito', cart: carrito });

    } catch (error) {
        console.error('Error en deleteProductsInCart:', error);
        return res.status(500).json({ msg: 'Error interno del servidor. Contacte con el administrador.' });
    }
};

export const updateProductsInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity) || quantity < 0) {
            return res.status(400).json({ msg: 'La cantidad debe ser un número mayor o igual a 0' });
        }

        const carrito = await cartModel.findById(cid);
        
        if (!carrito) {
            return res.status(404).json({ msg: `El carrito con el id ${cid} no existe` });
        }

        const productInCart = carrito.products.find(producto => producto.product.toString() === pid);
        
        if (!productInCart) {
            return res.status(404).json({ msg: `El producto con id ${pid} no está en el carrito` });
        }

        productInCart.quantity = quantity;

        await carrito.save();

        return res.json({ msg: 'La cantidad del producto se actualizó correctamente', cart: carrito });

    } catch (error) {
        console.error('Error en updateProductsInCart:', error);
        return res.status(500).json({ msg: 'Error interno del servidor. Contacte con el administrador.' });
    }
};

export const deleteAllProductsInCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params;

        const carrito = await cartModel.findById(cid);
        
        if (!carrito) {
            return res.status(404).json({ msg: `El carrito con el id ${cid} no existe` });
        }

        carrito.products = [];
        await carrito.save();

        return res.json({ msg: 'Todos los productos han sido eliminados del carrito', cart: carrito });

    } catch (error) {
        console.error('Error en deleteAllProductsInCart:', error);
        return res.status(500).json({ msg: 'Error interno del servidor. Contacte con el administrador.' });
    }
};
export const getCartById = async (id) => {
    return await cartModel.findById(id).populate('products');
};

export const addToCart = async (cartId, productId) => {
    const cart = await cartModel.findById(cartId);
    const productInCart = cart.products.find(p => p.id === productId);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({ id: productId, quantity: 1 });
    }
    await cart.save();
    return cart;
};

export const removeFromCart = async (cartId, productId) => {
    const cart = await cartModel.findById(cartId);
    cart.products = cart.products.filter(p => p.id !== productId);
    await cart.save();
    return cart;
};