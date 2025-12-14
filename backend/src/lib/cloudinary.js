import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';

dotenv.config(); // <-- This is the crucial fix.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return resolve(null);

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error.message);
          return resolve(null);
        }
        resolve(result);
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};