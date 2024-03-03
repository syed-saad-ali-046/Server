const mongoose = require('../Config/database');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    email: { type: String, unique: true, required: true },
    phoneNumber:  { type: Number, unique: true, required: true },
    password: String,
    profilePicture: String, // New field for profile picture
});

const User = mongoose.model('User', userSchema);

module.exports = User;
