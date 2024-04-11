const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuid } = require('uuid');
const VIDEO_PATH = './data/videos.json';

const readVideos = () => {
    const videosData = JSON.parse(fs.readFileSync(VIDEO_PATH));
    return videosData;
}

// GET /videos/
router.get('/', (_req, res) => {
    const videosData = readVideos();
    res.status(200).json(videosData);
});


// GET /videos/:id
router.get('/:videoId', (req, res) => {
    const videosData = readVideos();
    const currentVideo = videosData.find(video => video.id === req.params.videoId);

    if (!currentVideo) {
        return res.status(404).send('Video not found');
    }
    res.status(200).json(currentVideo);
});

//POST /videos/:id/comments
router.post('/:id/comments', (req, res) => {
    // Read Video data
    const videosData = readVideos();
    const currentVideo = videosData.find(video => video.id === req.params.id);

    // Create a new comment object
    const newCommentObj = {
        id: uuid(),
        name: req.body.name,
        comment: req.body.comment,
        likes: 0,
        timestamp: new Date().getTime()
    }

    // Push to video array
    currentVideo.comments.unshift(newCommentObj);

    // Update JSON file with new array
    fs.writeFileSync(VIDEO_PATH, JSON.stringify(videosData));
    res.status(201).json(newCommentObj);
});

//DELETE /videos/:videoId/comments/:commentId
router.delete('/:videoId/comments/:commentId', (req, res) => {
    const videosData = readVideos();
    const currentVideo = videosData.find(video => video.id === req.params.videoId);
    const commentIndexToBeDeleted = currentVideo.comments.find(comment => comment.id === req.params.commentId);
    const deletedComment = currentVideo.comments.splice(commentIndexToBeDeleted, 1)[0];

    fs.writeFileSync(VIDEO_PATH, JSON.stringify(videosData));
    res.status(200).json(deletedComment);
});

module.exports = router;