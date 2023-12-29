const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(books);
  return res.status(200).json({ message: "Successful" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnNo = req.params.isbn;
  let isbnBook = books[isbnNo];
  if (isbnBook) {
    return res.status(200).json({ isbnBook, message: "Succesful" });
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let authorRequested = req.params.author;
  let authorBook = Object.values(books).filter(
    (book) => book.author === authorRequested
  );

  if (authorBook.length > 0){
    return res.status(200).json({ authorBook, message: "Sucessful" });
  } else {
    return res.status(404).json({ error: "author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
