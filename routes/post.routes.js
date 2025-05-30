import express from 'express';

import { createPost, deletePost, getAllPosts, getPost, editpost } from '../controllers/postControllers.js';
import { protectRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/create', protectRoute, createPost);
router.put('/edit/:id', protectRoute, editpost);
router.delete('/delete/:id', protectRoute, deletePost);
router.get('/:id', getPost);

export default router;