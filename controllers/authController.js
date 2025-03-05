const User = require("../models/users");
const jwt = require("jsonwebtoken");

// Signup Route called when signup form is submitted on the frontend
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


  // Signin Route
  const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, email }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Signin successful", token });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


  module.exports = {signUp, signIn};