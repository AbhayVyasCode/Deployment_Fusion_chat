import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';
import { updateProfile } from '../controllers/user.controller.js'; // Renamed function

const router = express.Router();

// This route now uses upload.fields to accept two different files
router.post(
    '/settings', 
    protectRoute, 
    upload.fields([
        { name: 'profilePic', maxCount: 1 },
        { name: 'assistantImage', maxCount: 1 }
    ]), 
    updateProfile // Renamed route handler
);

export default router;