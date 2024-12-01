//Import Required Modules
//express: Used to create a router for defining routes related to user operations.
//multer: Middleware for handling file uploads.
//bcrypt: Library used for hashing passwords securely.
//User: The Mongoose model representing the User collection in MongoDB.

const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import User model
const { param } = require('./companiesRoutes');


const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');//file store at
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);// define the file name
    }
});



const upload = multer({
    storage: storage, // above variable within the fuction define the file name and loction
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});


router.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    console.log("SINGING IN FROM SERVER", req.body);
    
    const user = await User.findOne({email});

    console.log("THIS IS THE USER", user);
    console.log("PASSWORD", password);

    if (!user) {
        return res.status(404).json({ message: "No account with this email" });
    } else { 

        const validPassword = await bcrypt.compare(password, user.password);
        console.log("VALID PASSWORD", validPassword);
        if (!validPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        return res.status(200).json({ message: "User signed in successfully", user });
    }
})

// User Creation Endpoint// allow  code continue running when data  is not yet available
router.post('/create', async (req, res) => {

    const { fullName, email, password } = req.body;
    
    // Validate input
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    // Full name validation
    if (fullName.length < 3) {
        return res.status(400).json({ message: "Full name must be at least 3 characters long." });
    }
    
    // Password validation (example: min 8 characters, at least one number)
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number." });
    }

    //If there is a type field in the request body, use it. Otherwise, default to 'employee'.
    let type = 'employee';
    if(req.body.type) {
        type = req.body.type;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create new user
    const newUser = new User({ fullName, email, password: hashedPassword, type });
    
    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully!", user: newUser });
    } catch (error) {
        // Check for duplicate key error (email already exists)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ message: "Email already exists. Please use a different email address." });
        }
        res.status(500).json({ message: "Error creating user", error });
    }
});


// Update User Details Endpoint
router.patch('/:id', async (req, res) => {
    console.log("UPDATE USER", req.params.id);

    const { email, fullName, password, favoritedJobs } = req.body;
    console.log("UPDATE USER", req.body);
    
    try {
        const user = await User.findOne({ _id: req.params.id });
        console.log("USER", user);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Full name validation

        if (fullName && fullName.length < 3) {
            return res.status(400).json({ message: "Full name must be at least 3 characters long." });
        }

        if (fullName) user.fullName = fullName;
        if (password) {
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number." });
            }
            user.password = await bcrypt.hash(password, 10);
        }

        if(favoritedJobs) {
            return User.findOneAndUpdate(
                { _id: req.params.id }, 
                { $push: { favoritedJobs: favoritedJobs } }, 
                { new: true } // To return the updated document
              )
              .then(updatedUser => {
                // Handle the updated user document
                return res.status(200).json({ message: "User updated successfully", updatedUser });
              })
              .catch(err => {
                // Handle errors
    
                res.status(500).json({ message: "Error updating user", err });
              });
        }

    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
});

// Delete User Endpoint
router.delete('/delete', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});

// Retrieve All Users Endpoint
// Retrieve All Users
router.get('/getAll', async (req, res) => {
    try {
        const users = await User.find({}, 'fullName email type'); // Adjust fields as needed
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({_id: id}, 'fullName email type favoritedJobs'); // Adjust fields as needed
        res.status(200).json({message: "Retrieve user success", user});
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
    }
});


// Upload Image Endpoint
router.post('/uploadImage', upload.single('image'), async (req, res) => {
    const { email } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "Invalid file format. Only JPEG, PNG, and GIF are allowed." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.imagePath = req.file.path;
        await user.save();
        
        res.status(200).json({ message: "Image uploaded successfully", path: req.file.path });
    } catch (error) {
        res.status(500).json({ message: "Error uploading image", error });
    }
});

module.exports = router;
