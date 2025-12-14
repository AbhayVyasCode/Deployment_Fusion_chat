import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String, // Text is no longer required, as a message can be just a file
    },
    // --- New Fields ---
    imageUrl: {
        type: String,
    },
    fileUrl: {
        type: String,
    },
    // --- End of New Fields ---
  },
  { timestamps: true }
);

// Add compound index for efficient message retrieval
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;