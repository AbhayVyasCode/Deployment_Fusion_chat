import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../lib/socket.js';
import { uploadOnCloudinary } from '../lib/cloudinary.js';
import User from '../models/user.model.js';

// The getUsersForSidebar function has been removed from this file as it's now handled by the friend controller.

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    
    let imageUrl = '';
    let fileUrl = '';

    const receiver = await User.findById(receiverId);
    if (receiver.blockedUsers.includes(senderId)) {
        return res.status(403).json({ error: "You are blocked by this user and cannot send messages." });
    }
    
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);
      if (!cloudinaryResponse) {
        return res.status(500).json({ error: 'Failed to upload file to cloud' });
      }

      if (cloudinaryResponse.resource_type === 'image') {
        imageUrl = cloudinaryResponse.secure_url;
      } else {
        fileUrl = cloudinaryResponse.secure_url;
      }
    }

    if (!text && !imageUrl && !fileUrl) {
        return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || '',
      imageUrl,
      fileUrl,
    });
    
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error)
 {
    console.error('Error in sendMessage:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};