const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/auth.controller"); // Import the authentication controllers

// Define the signup route
router.post("/signup", signup);

// Define the login route
router.post("/login", login);

module.exports = router; // Export the router to be used in the main application