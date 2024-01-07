const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(201).json({
        username,
        message: "User registered successfully, Now you can login",
      });
    } else {
      return res.status(404).json({ message: "User already exist" });
    }
  }
  return res.status(400).json({ message: "Wrong username or password" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(books);
  return res.status(200).json({ message: "Successful" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnBook = books[isbnNo];
  if (isbnBook) {
    return res.status(200).json({ isbnBook, message: "Succesful" });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const bookAuthor = Object.values(books).filter(
    (book) => book.author === author
  );

  if (bookAuthor.length > 0) {
    return res.status(200).json({
      bookAuthor,
      message: `Book printed based on ${author} is successful `,
    });
  } else {
    return res.status(404).json({ error: "author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const titleRequested = req.params.title;
  const bookTitle = Object.values(books).filter(
    (book) => book.title === titleRequested
  );
  if (bookTitle.length > 0) {
    return res.status(200).json({ bookTitle, message: "Successful" });
  } else {
    return res.status(404).json({ error: "title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const requestedReview = req.params.isbn;
  const bookReview = books[requestedReview].reviews;

  if (bookReview) {
    return res.status(200).json({ bookReview, message: "Successful" });
  } else {
    return res.status(404).json({ error: "review not found" });
  }
});

// Task 10 Get book details based on ISBN
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("GET_URL_TO_FETCH_BOOKS"); // Ensure to use the actual API endpoint or the actual URL
    const books = response.data;
    res.status(200).json({ books, message: "Successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting list books", error: error.message });
  }
});

//Task 11 Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbnNo = req.params.isbn;
  try {
    const response = await axios.get(`GET_URL_TO_FETCH_BOOKS_BY_ISBN/${isbn}`); // Ensure to use the actual API endpoint or the actual URL
    const isbnBook = response.data;
    res
      .status(200)
      .json({ isbnBook, message: `Books by ${isbn} found successfully` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting books by isbn", error: error.message });
  }
});

// TASK 12 Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(
      `GET_URL_TO_FETCH_BOOKS_BY_ISBN/${author}`
    );
    const bookAuthor = response.data;

    if (bookAuthor.length > 0) {
      return res.status(200).json({
        bookAuthor,
        message: `Books by ${author} found successfully`,
      });
    } else {
      return res.status(404).json({ error: "Author not found" });
    }
  } catch (error) {
    console.error("Error:", error); //helps to log error message
    return res
      .status(500)
      .json({ message: "Error getting books by author", error: error.message });
  }
});

// TASK 13 Get book details based on titile
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`GET_URL_TO_FETCH_BOOKS_BY_ISBN/${title}`);
    const bookTitle = response.data;

    if (bookTitle.length > 0) {
      return res.status(200).json({
        bookTitle,
        message: `Books by ${title} found successfully`,
      });
    } else {
      return res.status(404).json({ error: "Book tittle not found" });
    }
  } catch (error) {
    console.error("Error:", error); //helps to log error message
    return res
      .status(500)
      .json({ message: "Error getting books by tittle", error: error.message });
  }
});

module.exports.general = public_users;
