import express from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();

// Login Route
router.post('/login', login);

// Register Route
router.post('/register', register);

export default router;
