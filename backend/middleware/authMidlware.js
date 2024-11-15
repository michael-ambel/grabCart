import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userProtector = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ error: "no token" });
      throw new Error("Unauthorized User");
    }
  } else {
    res.status(401).json({ error: "Need User" });
    // throw new Error("Need User");
  }
};

const adminProtector = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Not Authorized as Admin" });
    //throw new Error("Not Authorized as Admin");
  }
};

export { userProtector, adminProtector };
