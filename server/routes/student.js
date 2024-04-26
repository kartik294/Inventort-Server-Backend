import express from "express";
import { Student } from "../models/Student.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifiedAdmin } from "./auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  // Changed verifyAdmin to verifiedAdmin
  try {
    const { username, password, roll, grade } = req.body;
    const student = await Student.findOne({ username });

    if (student) {
      return res.json({ message: "student is registered" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(typeof hashPassword);
    const savedStudent = await Student.create({
      username,
      password: hashPassword,
      roll: roll,
      grade: grade,
    });
    console.log("Student saved successfully:", savedStudent);
    return res.json({
      registered: true,
    });
  } catch (err) {
    return res.json({
      message: "Error in Registering the student has occured",
    });
  }
});
export { router as studentRouter };
