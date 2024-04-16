require('dotenv').config();

const express = require('express');
const cors = require('cors');
const videosRouter = require('./routes/videos');

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({ origin: CLIENT_URL }));

// Enabling requests from browser applications
app.get('/', (_req, res) => {
    res.send('Welcome to my API!');
});


app.use((req, res, next) => {
    if (!req.query.api_key && req.originalUrl.startsWith('/videos')) {
        return res.status(401).send('Please provide an api_key as a query parameter');
    }
    // api_key is provided, let the user continue to the next middleware or endpoint
    next();
});

// Enabling req.body object for POST requests
app.use(express.json());

app.use('/videos', videosRouter);

//Enabling access to images
app.use("/public", express.static('public'));

app.listen(PORT, () => {
    console.log(`Server Listening on PORT:${PORT}`);
});

