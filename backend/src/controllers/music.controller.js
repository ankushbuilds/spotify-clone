const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');

const { uploadFile } = require('../services/storage.service');
const jwt = require('jsonwebtoken')

// Create a new music
async function createMusic(req, res) {
    const token = req.cookies.token;

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
    })

    res.status(201).json({
        message: "Music created Successfully",
        music: {
            id: music._id,
            title: music.title,
            uri: music.uri,
            artist: req.user.id
        }
    })

}


// Create a new Album
async function createAlbum(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const { title, musics } = req.body;
    const album = await albumModel.create({
        title,
        artist: req.user.id, // Assuming req.user.id contains the artist's ID
        musics: musics
    })
    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: req.user.id, // Assuming req.user.id contains the artist's ID
            musics: album.musics
        }
    })
}

// Get all musics
async function getAllMusics(req, res) {
    console.log("get all music passed");
    const musics = await musicModel.find().limit(2).populate("artist", "username email");
    console.log("Musics: ", musics)
    res.status(200).json({
        success: true,
        message: "All musics fetched successfully",
        musics: musics
    })
}

// Get all albums
async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select("title artist").populate("artist", "username email");
    res.status(200).json({
        message: "All album fetched successfully",
        albums: albums
    });
}

// Get album by id
async function getAlbumById(req, res) {
    const albumId = req.params.albumId;

    const album = await albumModel.findById(albumId).populate("artist", "username email")

    return res.status(200).json({
        message: "Album fetched successfuly",
        album: album
    })
}



module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };