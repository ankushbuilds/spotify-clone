const express = require('express');
const musicController = require('../controllers/music.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

// =====================
// ARTIST ROUTES
// =====================

// Upload music
router.post(
    '/upload',
    authMiddleware.authArtist,
    upload.single('music'),
    musicController.createMusic
);

// Create album
router.post(
    '/album',
    authMiddleware.authArtist,
    musicController.createAlbum
);

// =====================
// USER ROUTES
// =====================

// Get all songs
router.get(
    '/songs',
    authMiddleware.authUser,
    musicController.getAllMusics
);

// Get all albums
router.get(
    '/albums',
    authMiddleware.authUser,
    musicController.getAllAlbums
);

// Get single album
router.get(
    '/albums/:albumId',
    authMiddleware.authUser,
    musicController.getAlbumById
);

module.exports = router;