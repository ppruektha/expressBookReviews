const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Get all book list
    const booksCall = new Promise((resolve, reject)=>{
        //try and catch statement
        try{
           let bookList = books;
           resolve(bookList);
        }catch(err)
        {
            reject(err);
        }
    });

    booksCall.then(
        (bookList) => res.status(300).json(bookList),
        (err)=> res.status(500).json(err)
    );
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const bookCall = new Promise((resolve, reject)=> {  
        try{
            let bookList = books[req.params.isbn];
            resolve(bookList);
        }catch(err){
            reject (err);
        }
    });
    
    bookCall.then(
        (bookList) => res.status(300).json(bookList),
        (err) => res.status(500).json(err)
    );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  

    const bookCall = new Promise((resolve, reject)=>{
        try{
            let booksArray = [];
            for(const key in books){
                if(books.hasOwnProperty(key)){
                  const book = books[key];
                  booksArray.push(book);
                }
              }
            
              let filtered_books = booksArray.filter((book) => book.author === author);

              resolve(filtered_books);
        }catch(err)
        {
            reject(err);
        }       
    });
    bookCall.then(
        (filtered_books) => res.status(300).json(filtered_books),
        (err) => res.status(500).json(err)
    );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookCall = new Promise((resolve, reject)=>{
    try{
            let booksArray = [];
            for(const key in books){
                if(books.hasOwnProperty(key)){
                const book = books[key];
                booksArray.push(book);
                }
            }
            let filtered_books = booksArray.filter((book) => book.title === title);
            resolve(filtered_books);
        }catch(err){
            reject(err);
        }
    });

 
    bookCall.then(
        (filtered_books) => res.status(300).json(filtered_books),
        (err) => res.status(500).json(err)
    );

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
