import express from 'express';
import { protect } from '../middleware/auth';
import { getMe, login, register } from '../controller/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;