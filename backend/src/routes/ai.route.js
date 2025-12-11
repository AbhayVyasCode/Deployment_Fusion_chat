import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { askAssistant } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/ask', protectRoute, askAssistant);

export default router;