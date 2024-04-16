const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const { parse } = require('path');

const router = express.Router();
const VIDEO_PATH = './data/videos.json';
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '_' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const readVideos = () => {
    const videosData = JSON.parse(fs.readFileSync(VIDEO_PATH));
    return videosData;
}

// GET /videos/
router.get('/', (req, res) => {
    const videosData = readVideos();
    res.status(200).json(videosData);
});

// POST /videos/upload
router.post('/upload', upload.single("imageFile"), (req, res) => {
    const videosData = readVideos();
    const defaultImagePath = 'public/images/Upload-video-preview.jpg';
    const imagePath = req.protocol + '://' + req.get('host') + '/' + (req.file ? req.file.path : defaultImagePath);

    const newVideoObj = {
        id: uuid(),
        title: req.body.title,
        channel: "Shweta Chavan",
        image: imagePath,
        description: req.body.description,
        views: "0",
        likes: "0",
        duration: "0",
        video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
        timestamp: new Date().getTime(),
        comments: []
    }
    videosData.unshift(newVideoObj);
    fs.writeFileSync(VIDEO_PATH, JSON.stringify(videosData));
    res.status(201).json(newVideoObj);
})

// GET /videos/:videoId
router.get('/:videoId', (req, res) => {
    const videosData = readVideos();
    const currentVideo = videosData.find(video => video.id === req.params.videoId);

    if (!currentVideo) {
        return res.status(404).send('Video not found');
    }
    res.status(200).json(currentVideo);
});

// PUT /videos/:videoId/likes
router.put('/:videoId/likes', (req, res) => {
    const videosData = readVideos();
    const currentVideo = videosData.find(video => video.id === req.params.videoId);

    if (!currentVideo) {
        return res.status(404).send('Video not found');
    }
    const likes = parseInt(currentVideo.likes.replace(/,/g, ''));
    currentVideo.likes = (likes + 1).toLocaleString();

    fs.writeFileSync(VIDEO_PATH, JSON.stringify(videosData));
    res.status(200).json(currentVideo);
})

// POST /videos/:id/comments
router.post('/:videoId/comments', (req, res) => {
    const videosData = readVideos();
    const currentVideo = videosData.find(video => video.id === req.params.videoId);

    if (!currentVideo) {
        return res.status(404).send('Video not found');
    }

    const newCommentObj = {
        id: uuid(),
        name: req.body.name,
        comment: req.body.comment,
        likes: 0,
        timestamp: new Date().getTime()
    }
    currentVideo.comments.unshift(newCommentObj);

    fs.writeFileSync(VIDEO_PATH, JSON.stringify(videosData));
    res.status(201).json(newCommentObj);
});

// DELETE /videos/:videoId/comments/:commentId
router.delete('/:videoId/comments/:commentId', (req, res) => {
    const videosData = readVideos();
    const currentVideo = videosData.find(video => video.id === req.params.videoId);

    if (!currentVideo) {
        return res.status(404).send('Video not found');
    }

    const commentIndexToBeDeleted = currentVideo.comments.find(comment => comment.id === req.params.commentId);
    if (!commentIndexToBeDeleted) {
        return res.status(404).send('Comment not found');
    }

    const deletedComment = currentVideo.comments.splice(commentIndexToBeDeleted, 1)[0];

    fs.writeFileSync(VIDEO_PATH, JSON.stringify(videosData));
    res.status(200).json(deletedComment);
});

module.exports = router;