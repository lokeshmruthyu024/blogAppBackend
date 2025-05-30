import express from 'express'
import { loginUser, signupUser, logoutUser, getUser } from '../controllers/authControllers.js';
import { protectRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getme', getUser);

export default router;
