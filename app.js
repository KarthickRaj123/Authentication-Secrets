//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption")




const app = express();



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1/securetsDB");

const userShema = new mongoose.Schema ({
email: String,
password: String
});

//to encrypt the secret
userShema.plugin(encryption, {secret: process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User", userShema);



app.get("/home", function(req, res){
    res.render("home")
});


app.get("/login", function(req, res){
    res.render("login")
});

app.get("/register", function(req, res){
    res.render("register")
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }else{
            res.send(err);
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});









app.listen(3000, function(req, res){
    console.log("Listening 3000");
})