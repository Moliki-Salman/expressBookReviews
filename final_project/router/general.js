const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
    if (username && password) {
      if (!isValid(username)) {
        users.push({ username: username, password: password });
        return res
          .status(201)
          .json({ message: "User registered successfully, Now you can login" });
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
  const isbnNo = req.params.isbn;
  const isbnBook = books[isbnNo];
  if (isbnBook) {
    return res.status(200).json({ isbnBook, message: "Succesful" });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorRequested = req.params.author;
  const bookAuthor = Object.values(books).filter(
    (book) => book.author === authorRequested
  );

  if (bookAuthor.length > 0) {
    return res.status(200).json({ bookAuthor, message: "Sucessful" });
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
  const bookReview = books[requestedReview];

  if (bookReview) {
    return res.status(200).json({ bookReview, message: "Successful" });
  } else {
    return res.status(404).json({ error: "review not found" });
  }
});

module.exports.general = public_users;
