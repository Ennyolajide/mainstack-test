import { Request, Response } from 'express';
import Product from '../models/Product';

// Controller function to handle product creation
export const createProduct = async (req: Request, res: Response) => {
    try {
        const productsData = req.body;

        // If the request body is an array, treat it as a batch upload
        if (Array.isArray(productsData)) {
            const savedProducts = await Product.create(productsData);
            res.status(201).json(savedProducts);
        } else {
            // If the request body is a single object, treat it as a single upload
            const { name, price, imageUrl } = productsData;
            const newProduct = new Product({ name, price, imageUrl });
            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const skip = (page - 1) * pageSize;

        const products = await Product.find().skip(skip).limit(pageSize);

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Controller function to get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Controller function to update a product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, imageUrl } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            { name, price, imageUrl },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to delete a product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
