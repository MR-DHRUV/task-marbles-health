require('dotenv').config()
const express = require('express');
const Router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

// Get all users ?page=Y&search=XYZ
Router.get("/", async (req, res) => {

    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 15;
    const skip = (page - 1) * ITEM_PER_PAGE;
    const search= req.query.search;
    const query = {
        ...(search && { name: { $regex: search, $options: 'i' } }),
        ...(search && { email: { $regex: search, $options: 'i' } }),
    }

    try {
        const users = await User.find(query).skip(skip).limit(ITEM_PER_PAGE);
        const totalUsers = await User.countDocuments(query);
        res.json({ results: users, success: true, message: "Users fetched successfully", count: totalUsers});
    } catch (error) {
        res.status(500).json({ message: "Some error occured", success: false });
    }
});

// Create a new user
Router.post("/", [
    body('name').isLength({ min: 2 }).withMessage("Name must be atleast 3 characters long"),
    body('email').isEmail().withMessage("Invalid Email"),
    body('contact').isLength({ min: 10, max: 10 }).withMessage("Contact number must be 10 digits long"),
    body('dob').isDate().withMessage("Invalid Date of Birth"),
    body('description').isLength({ min: 1 }).withMessage("Description must be atleast 10 characters long"),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success: false });
    }

    const { name, email, contact, dob, description } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
        return res.status(400).json({ message: "User already exists with given email", success: false });
    }

    try {
        await User.create({ name, email, contact, dob, description, username: email });
        console.log("User created successfully")
        res.json({ success: true, message: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Some error occured", success: false });
    }
});

// Update user details
Router.put("/:id", [
    body('name').isLength({ min: 3 }).withMessage("Name must be atleast 3 characters long"),
    body('email').isEmail().withMessage("Invalid Email"),
    body('contact').isLength({ min: 10, max: 10 }).withMessage("Contact number must be 10 digits long"),
    body('dob').isDate().withMessage("Invalid Date of Birth"),
    body('description').isLength({ min: 10 }).withMessage("Description must be atleast 10 characters long"),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success: false });
    }

    const { name, email, contact, dob, description } = req.body;
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "User ID is required", success: false });
    }

    try {
        await User.findByIdAndUpdate(id, { name, email, contact, dob, description });
        res.json({ success: true, message: "User updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Some error occured", success: false });
    }
});

// Delete a user
Router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "User ID is required", success: false });
    }

    try {
        await User.findByIdAndDelete(id);
        res.json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Some error occured", success: false });
    }
});

module.exports = Router;

