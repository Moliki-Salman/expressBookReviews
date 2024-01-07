const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let matchedUser = users.filter((user) => {
    user.username === username;
  });
  if (matchedUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //do not add /customer to the route here; add /cutomer on postman to make it work
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  let accessToken = jwt.sign({ data: password }, "secretAccess", {
    expiresIn: 60 * 60,
  });
  req.session.authorization = {
    accessToken,
    username,
  };
  console.log("Session information during login:", req.session.authorization);
  return res.status(200).json({
    username,
    accessToken,
    message: `${username} logged in sucessfully `,
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //add /cutomer/auth.... on postman to make it work
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ error: "Book not found", isbn });
  }
  // Validate review content
  if (!review || typeof review !== "string") {
    return res.status(400).json({ error: "Invalid review content" });
  }

  const existingUserReview = books[isbn].reviews[username];
  if (existingUserReview) {
    // Modify existing review
    existingUserReview.review = review;
  } else {
    // Add a new review
    books[isbn].reviews[username] = { review };
  }
  res.json({ message: "Review posted successfully", review });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ error: "Book not found", isbn });
  }

  const existingUserReview = books[isbn].reviews[username];
  if (!existingUserReview) {
    return res.status(404).json({ error: "Review not found" });
  } else {
    delete books[isbn].reviews[username][review];
  }
  res.status(200).json({ message: "Review deleted successfully", review });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

