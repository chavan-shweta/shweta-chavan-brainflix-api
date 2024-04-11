const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuid } = require('uuid');
const VIDEO_PATH = './data/videos.json';

const readVideos = () => {
    const videosData = JSON.parse(fs.readFileSync(VIDEO_PATH));
    return videosData;
}


module.exports = router;