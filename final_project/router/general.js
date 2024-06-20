const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
   const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json('Username and password are required');
    }


    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json( 'Username already exists');
    }

    const newUser = { username, password };
    users.push(newUser);

    res.status(201).json('User registered successfully');
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    if (books[isbn]) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(books[isbn], null, 2));
    } else {
        res.status(404).json('Book not found');
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
    const foundBooks = [];

    Object.keys(books).forEach(key => {
        if (books[key].author === author) {
            foundBooks.push(books[key]);
        }
    });

    if (foundBooks.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(foundBooks, null, 2));
    } else {
        res.status(404).json('Book not found');
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
    const foundBook = Object.values(books).find(book => book.title === title);

    if (foundBook) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(foundBook, null, 2));
    } else {
        res.status(404).json('Book not found');
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(reviews, null, 2));
    } else {
        res.status(404).json('Book not found');
    }
});

module.exports.general = public_users;
