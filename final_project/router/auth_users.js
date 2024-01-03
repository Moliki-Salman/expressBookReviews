const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
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

const authenticatedUser = (username, password) => {
  let authUser = users.filter((user) => {
    user.username === username && user.password === password;
  });
  if (authUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  let accessToken = jwt.sign({ data: password }, "secretAcess", {
    expiresIn: 60 * 60,
  });
  req.session.authorization = {
    accessToken,
    username,
  };
  return res
    .status(200)
    .json({ username, message: "User logged in sucessfully" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;



