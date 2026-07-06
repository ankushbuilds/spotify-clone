const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

// =======================
// CREATE MUSIC
// =======================
async function createMusic(req, res) {
  try {
    const { title } = req.body;

    const musicFile = req.files?.music?.[0];
    const imageFile = req.files?.image?.[0];

    if (!musicFile) {
      return res.status(400).json({
        message: "Music file is required",
      });
    }

    // Upload music file
    const musicUpload = await uploadFile(
      musicFile.buffer.toString("base64")
    );

    // Upload image file (optional)
    let imageUrl = null;
    
    if (imageFile) {
      const imageUpload = await uploadFile(
        imageFile.buffer.toString("base64")
      );

      imageUrl = imageUpload.url;
    }
   console.log("IMAGE URL =>", imageUrl);
    // Save to DB
  const music = await musicModel.create({
  title,
  uri: musicUpload.url,
  image: imageUrl || "",   // 🔥 FORCE FIELD EXISTENCE
  artist: req.user.id,
});
    return res.status(201).json({
      message: "Music created successfully",
      music,
    });
  } catch (err) {
    console.error("createMusic error:", err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =======================
// CREATE ALBUM
// =======================
async function createAlbum(req, res) {
  try {
    const { title, musics } = req.body;

    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics,
    });

    return res.status(201).json({
      message: "Album created successfully",
      album,
    });
  } catch (err) {
    console.error("createAlbum error:", err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =======================
// GET ALL MUSICS
// =======================
async function getAllMusics(req, res) {
  try {
    const musics = await musicModel
      .find({})
      .limit(20)
      .populate("artist", "username email");

    return res.status(200).json({
      success: true,
      message: "All musics fetched successfully",
      musics,
    });
  } catch (err) {
    console.error("getAllMusics error:", err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =======================
// GET ALL ALBUMS
// =======================
async function getAllAlbums(req, res) {
  try {
    const albums = await albumModel
      .find({})
      .select("title artist musics")
      .populate("artist", "username email");

    return res.status(200).json({
      message: "All albums fetched successfully",
      albums,
    });
  } catch (err) {
    console.error("getAllAlbums error:", err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// =======================
// GET ALBUM BY ID
// =======================
async function getAlbumById(req, res) {
  try {
    const { albumId } = req.params;

    const album = await albumModel
      .findById(albumId)
      .populate("artist", "username email")
      .populate("musics");

    if (!album) {
      return res.status(404).json({
        message: "Album not found",
      });
    }

    return res.status(200).json({
      message: "Album fetched successfully",
      album,
    });
  } catch (err) {
    console.error("getAlbumById error:", err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
};