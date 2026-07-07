const express = require("express");
const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

// ARTIST ROUTES

router.post(
  "/upload",
  authMiddleware.auth,
  authMiddleware.authArtist,
  upload.fields([
    {
      name:"music",
      maxCount:1
    },
    {
      name:"image",
      maxCount:1
    }
  ]),
  musicController.createMusic
);

router.post(
  "/album",
  authMiddleware.auth,
  authMiddleware.authArtist,
  musicController.createAlbum
);

// USER + ARTIST ROUTES

router.get(
  "/songs",
  authMiddleware.auth,
  authMiddleware.authUser,
  musicController.getAllMusics
);

router.get(
  "/albums",
  authMiddleware.auth,
  authMiddleware.authUser,
  musicController.getAllAlbums
);

router.get(
  "/albums/:albumId",
  authMiddleware.auth,
  authMiddleware.authUser,
  musicController.getAlbumById
);

// DELETE MUSIC

router.delete(
  "/:id",
  authMiddleware.auth,
  authMiddleware.authArtist,
  musicController.deleteMusic
);

module.exports = router;