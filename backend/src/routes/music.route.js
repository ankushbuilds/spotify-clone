const express = require("express");
const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const playlistController = require("../controllers/playlist.controller");
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
      name: "music",
      maxCount: 1
    },
    {
      name: "image",
      maxCount: 1
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
  "/my-songs",
  authMiddleware.auth,
  authMiddleware.authUser,
  musicController.getMyMusics
)

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
// Recently played
router.post("/recent/:songId", authMiddleware.auth, authMiddleware.authUser, musicController.addRecentlyPlayed);

// Fetch Recently Played
router.get("/recent", authMiddleware.auth, authMiddleware.authUser, musicController.getRecentlyPlayed);

// Playlist
router.post(
  "/playlist/create",
  authMiddleware.auth,
  playlistController.createPlaylist
);

router.get(
  "/playlist/my",
  authMiddleware.auth,
  playlistController.getMyPlaylists
);
router.post(
 "/playlist/:playlistId/add-song/:songId",
 authMiddleware.auth,
 playlistController.addSongToPlaylist
);
router.delete(
  "/playlist/:id",
  authMiddleware.auth,
  playlistController.deletePlaylist
)
router.delete(
   "/playlist/:playlistId/remove-song/:songId",
    authMiddleware.auth,
 playlistController.removeSongFromPlaylist
)

module.exports = router;