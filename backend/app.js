const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require("helmet")
const apiLimiter = require("./middleware/expressRateLimit");
const path = require('path'); 
const messageRoutes = require('./routes/message'); 
const userRoutes = require('./routes/user');
const app = express();

app.use("/api/", apiLimiter);
app.use(helmet());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next(); 
});
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/message', messageRoutes); 
app.use('/api/user', userRoutes); 

module.exports = app;



