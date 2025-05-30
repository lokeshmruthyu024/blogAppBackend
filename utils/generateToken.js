import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  })
  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevent XSS attacks cross sites scripting the attacks
    sameSite: "strict", //CSRF attacks cross-sites request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  })
}