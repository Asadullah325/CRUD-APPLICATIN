import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createJWT } from "../utils/createJWTToken.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const ExistingUser = await User.findOne({ email });
        if (ExistingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token: createJWT(user._id)
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        res.cookie('jwt', createJWT(user._id), {
            httpOnly: true,
            sameSite: true,
            secure : true
        });

        res.status(200).json({
            message: 'User logged in successfully',
            user,
        })


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};