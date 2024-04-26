import express from "express";
import { Admin } from "../models/Admin.js";
import { Student } from "../models/Student.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log({ username, password, role });
    if (role === "admin") {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.json({ message: "admin not registered" });
      }
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.json({ message: "wrong password" });
      }
      const token = jwt.sign(
        { username: admin.username, role: "admin" },
        process.env.Admin_key
      );
      res.cookie("token", token, { httpOnly: true, secure: true });
      return res.json({ login: true, role: "admin" });
    } else if (role === "student") {
      const student = await Student.findOne({ username });
      if (!student) {
        return res.json({ message: "student not registered" });
      }
      const validPassword = await bcrypt.compare(password, student.password);
      if (!validPassword) {
        return res.json({ message: "wrong password" });
      }
      const token = jwt.sign(
        { username: student.username, role: "student" },
        process.env.Student_key
      );
      res.cookie("token", token, { httpOnly: true, secure: true });
      return res.json({ login: true, role: "student" });
    } else {
      return res.json({ message: "Invalid role" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
});

const verifiedAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({
      message: "Invalid Admin",
    });
  } else {
    jwt.verify(token, process.env.Admin_key, (err, decoded) => {
      if (err) {
        return res.json({
          message: "Invalid Token",
        });
      } else {
        req.username = decoded.username;
        req.role = decoded.role;
        next();
      }
    });
  }
};

const verifiedUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({
      message: "Invalid User",
    });
  } else {
    jwt.verify(token, process.env.Admin_key, (err, decoded) => {
      if (err) {
        jwt.verify(token, process.env.Student_key, (err, decoded) => {
          if (err) {
            return res.json({
              message: "Invalid Token",
            });
          } else {
            req.username = decoded.username;
            req.role = decoded.role;
            next();
          }
        });
      } else {
        req.username = decoded.username;
        req.role = decoded.role;
        next();
      }
    });
  }
};
router.get("/verify", verifiedUser, (req, res) => {
  return res.json({ login: true, role: req.role });
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ logout: true });
});
export { router as AdminRouter, verifiedAdmin };
