import dotenv from 'dotenv';
dotenv.config(); // Ensure this is at the very top

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import compression from 'compression'; // Import compression

// Import the new socket server instead of creating a new app
import { app, server } from './lib/socket.js';
import connectDB from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import aiRoutes from './routes/ai.route.js';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js'; // 1. Import message routes
import friendRoutes from './routes/friend.route.js'; // 1. Import friend routes

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(compression()); // Use compression middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/friends', friendRoutes);

// Health check route
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// 3. Use server.listen instead of app.listen
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});