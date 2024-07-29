const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>
    {return user.username === username;});
  if (userswithsamename.length > 0) {
    return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) =>{
    return user.username === username && user.password === password;
  });
  return validusers.length >0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if(!username||!password){
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)){
        // Generate JWT access token
        let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }

        
       
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            return res.status(200).json({ message: "User logged in successfully" });
        });

  }else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

  });
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
      const user = req.session.authorization["username"]
      const isbn = req.params.isbn;
      const review = req.body.review;
      books[isbn]["reviews"][user] = review;

      return res.status(403).json({ message: "A review has been ADDED/EDITTED to book with ISBN #"+isbn+" by USER: "+user});

});


regd_users.delete("/auth/delete/:isbn", (req, res) => {
    const user = req.session.authorization["username"]
    const isbn = req.params.isbn;
    delete books[isbn]["reviews"][user];

    return res.status(403).json({ message: "A review has been DELETED for a book with ISBN #"+isbn+" by USER: "+user});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
