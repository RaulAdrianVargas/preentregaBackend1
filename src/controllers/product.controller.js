import { request, response } from "express";
import { productModel } from "../models/products.js";

export const getProducts = async (req = request, res = response) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const skip = (page - 1) * limit;
        const sortOrder = { 'asc': 1, 'desc': -1 };
        const sortOption = sort ? { price: sortOrder[sort] } : {};

        const [productos, totalDocs] = await Promise.all([
            productModel.find(query).limit(limit).skip(skip).sort(sortOption).lean(),
            productModel.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalDocs / limit);
        
        return res.render('home', {
            productos, // Productos obtenidos
            totalDocs, // Número total de productos
            totalPages, // Total de páginas
            limit, // Límite de productos por página
            page, // Página actual
            hasNextPage: page < totalPages, // Si hay una página siguiente
            hasPrevPage: page > 1, // Si hay una página anterior
            prevPage: page > 1 ? page - 1 : null, // Número de la página anterior
            nextPage: page < totalPages ? page + 1 : null, // Número de la página siguiente
            style: 'style.css' // Estilo de la página
        });
    } catch (error) {
        console.log("getProducts -> ", error);
        return res.status(500).json({ msg: "Hablar con un administrador" });
    }
};

export const getProductsById = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await productModel.findById(pid);
        if (!producto) 
            return res.status(404).json({ msg: `Producto con ID ${pid} no encontrado` });
        
        return res.json({ producto });
    } catch (error) {
        console.log("getProductsById -> ", error);
        return res.status(500).json({ msg: "Error al obtener producto" });
    }
};

export const addProduct = async (req = request, res = response) => {
    try {
        const { title, description, price, code, stock, category } = req.body;

        const producto = await productModel.create({ title, description, price, code, stock, category });
        
        return res.json({ producto });
    } catch (error) {
        if (error.code === 11000) 
            return res.status(400).json({ msg: `El código "${req.body.code}" ya está en uso.` });
        
        console.log("addProduct -> ", error);
        return res.status(500).json({ msg: "Error al agregar producto" });
    }
};

export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await productModel.findByIdAndUpdate(pid, req.body, { new: true });

        if (!producto) 
            return res.status(404).json({ msg: `Producto con ID ${pid} no encontrado` });
        
        return res.json({ msg: "Producto actualizado", producto });
    } catch (error) {
        console.log("updateProduct -> ", error);
        return res.status(500).json({ msg: "Error al actualizar producto" });
    }
};

export const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        const producto = await productModel.findByIdAndDelete(pid);

        if (!producto) 
            return res.status(404).json({ msg: `Producto con ID ${pid} no encontrado` });
        
        return res.json({ msg: "Producto eliminado", producto });
    } catch (error) {
        console.log("deleteProduct -> ", error);
        return res.status(500).json({ msg: "Error al eliminar producto" });
    }
};

export const getPaginatedProducts = async (page = 1) => {
    const limit = 10; 
    const skip = (page - 1) * limit;
    const products = await productModel.find().skip(skip).limit(limit);
    const total = await productModel.countDocuments();

    return {
        products,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        prevPage: page - 1,
        nextPage: page + 1,
    };
};

export const getProductById = async (id) => {
    return await productModel.findById(id);
};