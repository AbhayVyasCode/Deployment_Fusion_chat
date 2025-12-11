import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';
// This is the crucial fix: The import for 'getUsersForSidebar' is removed.
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

// The '/users' route has been removed from this file.
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, upload.single('file'), sendMessage);

export default router;