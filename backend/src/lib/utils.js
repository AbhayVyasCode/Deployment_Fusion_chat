import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Prevents XSS attacks (cookie not accessible from JS)
    sameSite: "strict", // CSRF protection
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
  });

  return token;
};