const express = require('express');
const mongoose = require('./Config/database');
const session = require('express-session');
const cors = require('cors');
const signupRoutes = require('./Routes/signupRoutes');
const signinRoutes = require('./Routes/signinRoutes');
const userRoute = require('./Routes/userRoute');
const profilepicRoute = require('./Routes/profilepicRoute');
const crypto = require('crypto');

const generateRandomString = () => {
    return crypto.randomBytes(32).toString('hex');
};

const secretKey = process.env.SESSION_SECRET || generateRandomString();
console.log(secretKey);

const app = express();
const port = process.env.PORT || 8000;

// Define CORS options
const corsOptions = {
    origin: 'https://frontend-ss.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204, // to handle preflight requests
};

// Enable CORS
app.use(cors(corsOptions));

app.use(express.json());
app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
       
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 1000 * 60 * 6, // 1 day in milliseconds
        },
    })
);

// Handle CORS preflight requests
app.options('*', cors());

app.use('/api/user', signupRoutes);
app.use('/api/user', signinRoutes);
app.use('/api/user', userRoute);
app.use('/api/user', profilepicRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use('/.netlify/functions/api', router);
module.exports.handlers = serverless(app);
