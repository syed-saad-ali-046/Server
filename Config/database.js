// server/config/database.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Farhang:Farhang@farhang1.o060rhl.mongodb.net/User', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = mongoose;
