const express = require("express");
const User = require("../Models/user");

const router = express.Router();


// =====================================
// REGISTER USER
// =====================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            password,
            role
        } = req.body;


        // Check whether email already exists

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }


        // Create new user

        const newUser = new User({

            name,
            phone,
            email,
            password,
            role

        });


        // Save user

        const savedUser = await newUser.save();


        res.status(201).json({

            message: "User registered successfully",

            user: savedUser

        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({

            message: "Server error",
            error: error.message

        });

    }

});



// =====================================
// LOGIN USER
// =====================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check whether email and password are provided

        if (!email || !password) {

            return res.status(400).json({

                message: "Email and password are required"

            });

        }


        // Find user by email

        const user = await User.findOne({ email });

        // User not found

        if (!user) {

            return res.status(401).json({

                message: "Invalid email or password"

            });

        }


        // Check password

        if (user.password !== password) {

            return res.status(401).json({

                message: "Invalid email or password"

            });

        }


        // Login successful

        res.status(200).json({

            message: "Login successful",

            user: user

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});



// =====================================
// UPDATE FARM INFORMATION
// =====================================

router.put("/update/:id", async (req, res) => {

    try {

        const userId = req.params.id;

        const {
            farmName,
            farmLocation,
            mainProduce
        } = req.body;


        // Find user and update farm information

        const updatedUser = await User.findByIdAndUpdate(

            userId,

            {
                farmName,
                farmLocation,
                mainProduce
            },

            {
                new: true,
                runValidators: true
            }

        );


        // User not found

        if (!updatedUser) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        // Success response

        res.status(200).json({

            message: "Farm information updated successfully",

            user: updatedUser

        });

    } catch (error) {

        console.error(
            "Farm information update error:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});



// =====================================
// GET USER BY ID
// =====================================

router.get("/:id", async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        res.status(200).json({

            user

        });

    } catch (error) {

        console.error("Get user error:", error);

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


module.exports = router;