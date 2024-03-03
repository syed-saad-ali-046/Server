const express = require('express');
const mongoose = require('./Config/database');
const session = require('express-session');
const cors = require('cors');
const signupRoutes = require('./Routes/signupRoutes');
const signinRoutes = require('./Routes/signinRoutes');
const userRoute = require('./Routes/userRoute');
const profilepicRoute= require('./Routes/profilepicRoute');
const crypto = require('crypto');

const generateRandomString = () => {
    return crypto.randomBytes(32).toString('hex');
};

const secretKey = process.env.SESSION_SECRET || generateRandomString();
console.log(secretKey);

const app = express();
const port = process.env.PORT || 8000;

// Use the cors middleware with specific options
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable cookies and credentials for cross-origin requests
    optionsSuccessStatus: 204, // No Content for preflight requests
};

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
app.options('*', cors(corsOptions));

app.use('/api/user', signupRoutes);
app.use('/api/user', signinRoutes);
app.use('/api/user', userRoute);
app.use('/api/user', profilepicRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello Page</title>
      </head>
      <body>
        <h1>Hello</h1>
      </body>
      </html>
    `);
  });