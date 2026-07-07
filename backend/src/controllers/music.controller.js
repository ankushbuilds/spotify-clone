const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

// =======================
// CREATE MUSIC
// =======================
async function createMusic(req, res) {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const musicFile = req.files?.music?.[0];
    const imageFile = req.files?.image?.[0];

    if (!musicFile) {
      return res.status(400).json({
        success: false,
        message: "Music file is required",
      });
    }

    // ================= UPLOAD MUSIC =================
    const musicUpload = await uploadFile(
      musicFile.buffer.toString("base64")
    );

    if (!musicUpload?.url) {
      return res.status(500).json({
        success: false,
        message: "Music upload failed",
      });
    }

    // ================= UPLOAD IMAGE =================
    let imageUrl = "";

    if (imageFile) {
      try {
        const imageUpload = await uploadFile(
          imageFile.buffer.toString("base64")
        );
        imageUrl = imageUpload?.url || "";
      } catch (imgErr) {
        console.log("Image upload failed (non-blocking):", imgErr.message);
      }
    }

    console.log("🎵 MUSIC URL =>", musicUpload.url);
    console.log("🖼 IMAGE URL =>", imageUrl);

    // ================= SAVE TO DB =================
    const music = await musicModel.create({
      title: title.trim(),
      uri: musicUpload.url,
      image: imageUrl,
      artist: req.user?.id,
    });

    return res.status(201).json({
      success: true,
      message: "Music created successfully",
      music: {
        _id: music._id,
        title: music.title,
        uri: music.uri,
        image: music.image || "",
        artist: music.artist,
      },
    });
  } catch (err) {
    console.error("createMusic error:", err);

    return res.status(500).json({
      success: false,
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

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const album = await albumModel.create({
      title: title.trim(),
      artist: req.user?.id,
      musics: Array.isArray(musics) ? musics : [],
    });

    return res.status(201).json({
      success: true,
      message: "Album created successfully",
      album,
    });
  } catch (err) {
    console.error("createAlbum error:", err);

    return res.status(500).json({
      success: false,
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
      .limit(100)
      .populate("artist", "username email");

    const formatted = musics.map((m) => ({
      _id: m._id,
      title: m.title,
      uri: m.uri,
      image: m.image || "",
      artist: m.artist || null,
    }));

    return res.status(200).json({
      success: true,
      musics: formatted,
    });
  } catch (err) {
    console.error("getAllMusics error:", err);

    return res.status(500).json({
      success: false,
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
      .populate("artist", "username email");

    return res.status(200).json({
      success: true,
      albums,
    });
  } catch (err) {
    console.error("getAllAlbums error:", err);

    return res.status(500).json({
      success: false,
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
        success: false,
        message: "Album not found",
      });
    }

    return res.status(200).json({
      success: true,
      album,
    });
  } catch (err) {
    console.error("getAlbumById error:", err);

    return res.status(500).json({
      success: false,
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