// import environment variables
require('dotenv').config;

// middleware
const express = require('express');
const cors = require('cors');

// build app
const app = express();
app.use(express.json());
app.use(cors());

// routing
const routes = require('./routing');
app.use('/api/', routes);

// connect to database and listen for requests
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { dbName: 'My Portfolio'})
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Server Connected on ', process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });