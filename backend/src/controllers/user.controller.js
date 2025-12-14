import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../lib/cloudinary.js';

// This new function handles all profile and assistant updates
export const updateProfile = async (req, res) => {
  try {
    const { fullName, assistantName } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (assistantName) updateData.assistantName = assistantName;

    // Handle multiple file uploads
    if (req.files) {
      // If a user profile picture is uploaded
      if (req.files.profilePic) {
        const cloudinaryResponse = await uploadOnCloudinary(req.files.profilePic[0].buffer);
        if (cloudinaryResponse) {
          updateData.profilePic = cloudinaryResponse.secure_url;
        }
      }
      // If an assistant image is uploaded
      if (req.files.assistantImage) {
        const cloudinaryResponse = await uploadOnCloudinary(req.files.assistantImage[0].buffer);
        if (cloudinaryResponse) {
          updateData.assistantImage = cloudinaryResponse.secure_url;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No changes to save." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};