const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if(isValid(username)){
      users.push({username: username, password: password});
      return res.status(200).json({message: "User registered successfully"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Invalid username or password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,2));
});

// Get the book list available using Promise callbacks
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 2));
  })
  .then((result) => {
    res.send(result);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on ISBN with Promise callbacks
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    resolve(books[isbn]);
  })
  .then((result) => {
    res.send(result);
  })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  // get all keys for books
  let keys = Object.keys(books);
  // filter books by author
  let filtered_books = keys.filter(key => books[key].author === author);
  // return filtered books
  res.send(filtered_books.map(key => books[key]));
});

// Get book details based on author with Promise callbacks
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    // get all keys for books
    let keys = Object.keys(books);
    // filter books by author
    let filtered_books = keys.filter(key => books[key].author === author);
    // return filtered books
    resolve(filtered_books.map(key => books[key]));
  })
  .then((result) => {
    res.send(result);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  // get all keys for books
  let keys = Object.keys(books);
  // filter books by title
  let filtered_books = keys.filter(key => books[key].title === title);
  // return filtered books
  res.send(filtered_books.map(key => books[key]));
});

// Get all books based on title with Promise callbacks
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    // get all keys for books
    let keys = Object.keys(books);
    // filter books by title
    let filtered_books = keys.filter(key => books[key].title === title);
    // return filtered books
    resolve(filtered_books.map(key => books[key]));
  })
  .then((result) => {
    res.send(result);
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});


module.exports.general = public_users;
