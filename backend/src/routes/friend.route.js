import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
    searchUsers, 
    sendFriendRequest, 
    acceptFriendRequest, 
    getFriends, 
    getFriendRequests,
    getOnlineUsersForDiscovery,
    blockUser, unblockUser, deleteFriend    // 1. Import the new function
} from '../controllers/friend.controller.js';

const router = express.Router();

router.get('/search', protectRoute, searchUsers);
router.post('/send/:id', protectRoute, sendFriendRequest);
router.post('/accept/:id', protectRoute, acceptFriendRequest);
router.get('/', protectRoute, getFriends);
router.get('/requests', protectRoute, getFriendRequests);
router.get('/online', protectRoute, getOnlineUsersForDiscovery); // 2. Add the new route
router.post('/block/:id', protectRoute, blockUser); // 3. Add the new route
router.post('/unblock/:id', protectRoute, unblockUser); // 4. Add the new route
router.delete('/delete/:id', protectRoute, deleteFriend); // 5. Add the new route


export default router;