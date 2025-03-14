import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createJWT } from "../utils/createJWTToken.js";
import cloudinary from "../utils/cloudinary.js";

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || phone) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        let imageUrl = null;
        let logoID = null;

        // Handle image upload if provided
        if (req.files && req.files.imageUrl) {
            try {
                const fileUpload = await cloudinary.uploader.upload(req.files.imageUrl.tempFilePath, {
                    folder: "users"
                });
                imageUrl = fileUpload.secure_url;
                logoID = fileUpload.public_id;
                console.log("Image uploaded successfully", imageUrl, logoID);
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Image upload failed' });
            }
        }

        const user = await User.create({ name, email, password: hashedPassword, imageUrl, logoID });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                imageUrl,
                logoID
            }
        });

    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


/**
 * @desc   Login user
 * @route  POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = createJWT(user._id);

        // Set secure cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc   Logout user
 * @route  POST /api/auth/logout
 * @access Private
 */
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict' });
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error("Logout Error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
