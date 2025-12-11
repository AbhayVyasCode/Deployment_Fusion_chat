import User from '../models/user.model.js';
import { getReceiverSocketId, io } from '../lib/socket.js';
import { userSocketMap } from '../lib/socket.js'; // 1. Import the socket map

// --- Search for new users to add ---
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user._id;

        if (!query) {
            return res.status(200).json([]);
        }

        const loggedInUser = await User.findById(userId);

        const users = await User.find({
            fullName: { $regex: query, $options: 'i' }, // Case-insensitive search
            _id: { 
                $ne: userId, // Not the user themselves
                $nin: loggedInUser.friends, // Not already friends
                $nin: loggedInUser.sentFriendRequests, // Not already sent a request
                $nin: loggedInUser.receivedFriendRequests, // Not already received a request
            } 
        }).select('fullName profilePic');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const blockUser = async (req, res) => {
    try {
        const { id: userIdToBlock } = req.params;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $addToSet: { blockedUsers: userIdToBlock } });
        res.status(200).json({ message: "User blocked." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { id: userIdToUnblock } = req.params;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $pull: { blockedUsers: userIdToUnblock } });
        res.status(200).json({ message: "User unblocked." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteFriend = async (req, res) => {
    try {
        const { id: friendId } = req.params;
        const userId = req.user._id;
        // This is a mutual action: both users are removed from each other's friends list
        await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
        res.status(200).json({ message: "Friend removed." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// --- Send a friend request ---
export const sendFriendRequest = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        await User.findByIdAndUpdate(senderId, { $addToSet: { sentFriendRequests: receiverId } });
        await User.findByIdAndUpdate(receiverId, { $addToSet: { receivedFriendRequests: senderId } });
        
        // Real-time notification
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newFriendRequest', req.user);
        }

        res.status(200).json({ message: "Friend request sent." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// --- Accept a friend request ---
export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const receiverId = req.user._id;

        // Add each other to friends list
        await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId }, $pull: { receivedFriendRequests: senderId } });
        await User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId }, $pull: { sentFriendRequests: receiverId } });
        
        // Real-time notification
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit('friendRequestAccepted', req.user);
        }

        res.status(200).json({ message: "Friend request accepted." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// --- Get all current friends ---
export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friends', 'fullName profilePic');
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// --- Get all pending friend requests ---
export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('receivedFriendRequests', 'fullName profilePic');
        res.status(200).json(user.receivedFriendRequests);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getOnlineUsersForDiscovery = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const onlineUserIds = Object.keys(userSocketMap); // Get IDs of all online users

        const loggedInUser = await User.findById(loggedInUserId);
        const excludedIds = [
            ...loggedInUser.friends,
            ...loggedInUser.sentFriendRequests,
            ...loggedInUser.receivedFriendRequests,
            loggedInUserId // Exclude the user themselves
        ];

        // Find users who are online but are not already connected to the logged-in user
        const users = await User.find({
            _id: { $in: onlineUserIds, $nin: excludedIds }
        }).select('fullName profilePic');

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getOnlineUsersForDiscovery:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};