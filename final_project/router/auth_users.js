const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  if (users.length === 0){
    return true;
  }
  let userswithsamename = user.filter((user)=>{
    return user.username === username;
  })
  if(userswithsamename.length>0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password);
  })
  if (validusers.length>0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Invalid username or password"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message: "User logged in successfully"});
  } else {
    return res.status(208).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
    } else {
      books[isbn].reviews[username] = review;
    }
    return res.status(200).json({message: "Review added successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Delete the review for the given ISBN
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(404).json({message: "Review not found"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
