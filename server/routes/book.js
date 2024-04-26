import express from "express";
import { Book } from "../models/Book.js";

import bcrypt from "bcrypt";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { name, author, imageUrl } = req.body;

    const newBook = await Book.create({
      name,
      author,
      imageUrl,
    });

    console.log("Book saved successfully:", newBook);

    return res.json({
      added: true,
    });
  } catch (err) {
    console.error("Error in adding book:", err);
    return res.status(500).json({
      message: "Error in adding book",
    });
  }
});

router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    return res.json(books);
  } catch (err) {
    return res.json();
  }
});

router.get("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById({ _id: id });
    return res.json(book);
  } catch (err) {
    return res.json();
  }
});

router.put("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findByIdAndUpdate({ _id: id }, req.body);
    return res.json({
      updated: true,
      book,
    });
  } catch (err) {
    return res.json();
  }
});

router.delete("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findByIdAndDelete(id); // Corrected usage of findByIdAndDelete
    return res.json({
      deleted: true,
      book,
    });
  } catch (err) {
    console.error("Error deleting book:", err);
    return res.status(500).json({
      error: "An error occurred while deleting the book",
    });
  }
});

export { router as bookRouter };
