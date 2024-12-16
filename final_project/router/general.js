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
    if (isValid(username)) {
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
public_users.get('/',async function (req, res) {
   let bs = await JSON.stringify(books);
  res.status(200).send(bs);
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // const isbn = req.params.isbn;
  // if(books[isbn]){
  //   res.status(200).send(JSON.stringify(books[isbn]));
  // }else{
  //   res.status(404).send("The ISBN given is not valide !");
  // }
  //--Promise version
  const isbn = req.params.isbn;
  let bookPromise = new Promise((resolve,reject) => {
    if(books[isbn]){
        resolve(JSON.stringify(books[isbn]));
      }else{
        reject("The ISBN given is not valide !");
      }
  });
  bookPromise.then((book)=>{
    res.status(200).send(book);
  }).catch((e)=>{
    res.send(e);
  })

 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookWithAuthor='';
  for (let key in books) {
    if (books[key].author === author) {
        bookWithAuthor = await books[key];
        break;  
      }
  }

  if(bookWithAuthor !== ''){  
    res.send(JSON.stringify(bookWithAuthor));

  }else{
    res.status(404).send("There is not book with '"+author+"'as a author");
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookWithTitle='';
  for (let key in books) {
    if (books[key].title === title) {
      bookWithTitle = await books[key];
        break;
      }
  }

  if(bookWithTitle !== ''){
    res.send(JSON.stringify(bookWithTitle));

  }else{
    res.status(404).send("There is not book with '"+title+"' as a title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    res.status(200).send(JSON.stringify(books[isbn].review));
  }else{
    res.status(404).send("The ISBN given is not valide !");
  }
});



module.exports.general = public_users;
