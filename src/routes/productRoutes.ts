import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

const router = express.Router();

router.use(authMiddleware);

// Create a new product
router.post('/', createProduct);

// Get all products
router.get('/', getAllProducts);

// Get a single product
router.get('/:productId', getProductById);

// Update a product
router.put('/:productId', updateProduct);

// Delete a product
router.delete('/:productId', deleteProduct);

export default router;
