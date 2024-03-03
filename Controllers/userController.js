// server/controllers/userController.js
const bcrypt = require('bcrypt');
const User = require('../Models/userModel');
const multer = require('multer');

const saltRounds = 10;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function signup(req, res) {
    const { firstName, lastName, dateOfBirth, email, phoneNumber, password } = req.body;

    try {
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstName,
            lastName,
            dateOfBirth,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            // Duplicate email error
            return res.status(400).json({ message: 'Email is already registered' });
        }

        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
// server/controllers/userController.js
async function signin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Retrieve additional user information if needed
        const fullUser = await User.findById(user._id);

        // Check if the user exists
        if (!fullUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Store user information in session
        req.session.user = {
            _id: fullUser._id,
            email: fullUser.email,
            firstName: fullUser.firstName,
            phoneNumber:fullUser.phoneNumber,
            // ... add other user properties as needed
        };

        res.status(200).json({ message: 'Signin successful', user: req.session.user });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
// server/controllers/userController.js
async function getUserProfile(req, res) {
    try {
        // Check if the user is authenticated by looking at the session
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Retrieve user information from the session
        const user = req.session.user;

        // Use the User model to find the user by ID
        const fullUser = await User.findById(user._id);

        if (!fullUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if the user has a profile picture
        if (fullUser.profilePicture) {
            // Convert hexadecimal to base64 before sending in the response
            const base64EncodedProfilePicture = Buffer.from(fullUser.profilePicture, 'hex').toString('base64');

            // Return user profile information, including profile picture URL and phone number
            return res.status(200).json({
                user: {
                    ...fullUser.toJSON(),
                    profilePicture: base64EncodedProfilePicture,
                },
            });
        } else {
            // Return user profile information without a profile picture
            return res.status(200).json({
                user: {
                    ...fullUser.toJSON(),
                    profilePicture: null, // You can customize this value based on your frontend handling
                },
            });
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function uploadProfilePicture(req, res) {
    try {
        // Check if the user is authenticated
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = req.session.user;

        // Check if the request contains a file
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Update the user model with the profile picture data as a string
        const profilePictureDataBuffer = req.file.buffer;
        const profilePictureHexString = profilePictureDataBuffer.toString('hex');

        await User.findByIdAndUpdate(user._id, { profilePicture: profilePictureHexString });

        res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { signup, signin, getUserProfile, uploadProfilePicture };
