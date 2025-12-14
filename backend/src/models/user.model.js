import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 6 },
    // --- Google Auth ---
    isGoogleAuth: { type: Boolean, default: false },
    // -------------------
    profilePic: { type: String, default: "" },
    assistantName: { type: String },
    assistantImage: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    receivedFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // --- New Field ---
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // --- End New Field ---
  },
  { timestamps: true }
);

// Add index for searching users
userSchema.index({ fullName: 1 });

const User = mongoose.model("User", userSchema);
export default User;