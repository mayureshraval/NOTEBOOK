// express.js express validator bcrypt jsonwebtoken
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../Models/User");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const getUser = require('../Middlewares/getUser');
router.post("/", (req, res) => {
  res.send("Go to /signup /login");
});
const secret = 'Mpower@1';

// signup 
router.post(
  "/signup",
  [
    body("name", "Name should be of mininum 2 letters").isLength({ min: 2 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?\\/])[a-zA-Z\d!@#$%^&*()_+~`\-={}[\]:;"'<>,.?\\/]{8,}$/
      )
      .withMessage(
        "\nPassword must be atleast 8 characters long.\nContains at least one uppercase letter.\nContains at least one lowercase letter.\nContains at least one number.\nContains at least one Special Character"
      ),
  ],
  async (req, res) => {
    // validation error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array()});
      const errorMsg = errors.array().map((element) => {
        return element.msg;
      });
      return res.status(400).send("Validation Error - " + errorMsg);
    }
    // validation error handling

    // checking for duplicate email
    const emailDupCheck = await User.findOne({ email: req.body.email });
    if (emailDupCheck) {
      return res.status(400).send("User with this email already exists");
    }
    // checking for duplicate email

    // creating user account if all goes well.
    try {
      // bcryptjs
      var salt = bcrypt.genSaltSync(10);
      var hashedPassword = bcrypt.hashSync(req.body.password, salt);
      // bcryptjs

      // creating a new user using req.body and the User model.
      //   const user = new User(req.body);
      //   await user.save();
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
    //   we donot need to create a new instance like the .save() we can directly pass the data to the model.
    // giving a token if the sign in is approved
      var token = jwt.sign({id: newUser._id}, secret);
      
      console.log("User save successfull");
      res.send(newUser + token);
    } catch (error) {
      console.log("Error saving user -  " + error);
      res.status(400).send("User save failed :(\n" + error);
    }
    // creating user account if all goes well.
  }
);
// signup 

// sign in
router.post(
    "/login",
    [
      body("email", "Enter a valid Email").isEmail(),
      body("password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?\\/])[a-zA-Z\d!@#$%^&*()_+~`\-={}[\]:;"'<>,.?\\/]{8,}$/
        )
        .withMessage(
          "\nPassword must be atleast 8 characters long.\nContains at least one uppercase letter.\nContains at least one lowercase letter.\nContains at least one number.\nContains at least one Special Character"
        ),
    ],
    async (req, res) => {
      // validation error handling
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //   return res.status(400).json({ errors: errors.array()});
        const errorMsg = errors.array().map((element) => {
          return element.msg;
        });
        return res.status(400).send("Validation Error - " + errorMsg);
      }
      // validation error handling
  
      // checking if the user exists
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send("No user found with this email.");
      }
      // checking if the user exists
      try {
        // bcryptjs
        const userLegit = bcrypt.compareSync(req.body.password, user.password); 
        if (!userLegit) {
            return res.status(401).send('Password incorrect.');
        }
        // bcryptjs
        // giving a token if user is legit
        var token = jwt.sign({id: user._id}, secret);
        console.log("login Successfull successfull");
        res.send(token);
        // giving a token if user is legit
      } catch (error) {
        res.status(400).send("Login failed :(\n" + error);
      }
    }
  );
// sign in

// getuser
router.post(
    "/getuser", getUser ,
    async (req, res) => {
      try {
      const id = req.id;
      const user = await User.findOne({ _id: id }, '-password -__v -date');
      if (!user) {
        return res.status(404).send("User Not Found!");
      }
      return res.send(user);
      } catch (error) {
        res.status(500).send("Internal Server Error - " + error);
      }
    }
  );
// getuser
module.exports = router;
