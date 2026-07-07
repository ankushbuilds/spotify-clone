const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

// CREATE MUSIC
async function createMusic(req,res){
  try{
    const {title}=req.body;

    if(!title || !title.trim()){
      return res.status(400).json({
        success:false,
        message:"Title is required"
      });
    }

    const musicFile=req.files?.music?.[0];
    const imageFile=req.files?.image?.[0];

    if(!musicFile){
      return res.status(400).json({
        success:false,
        message:"Music file is required"
      });
    }

    const musicUpload=await uploadFile(
      musicFile.buffer.toString("base64")
    );

    if(!musicUpload?.url){
      return res.status(500).json({
        success:false,
        message:"Music upload failed"
      });
    }

    let imageUrl="";

    if(imageFile){
      try{
        const imageUpload=await uploadFile(
          imageFile.buffer.toString("base64")
        );

        imageUrl=imageUpload?.url || "";

      }catch(err){
        console.log("Image upload failed:",err.message);
      }
    }

    const music=await musicModel.create({
      title:title.trim(),
      uri:musicUpload.url,
      image:imageUrl,
      artist:req.user.id
    });

    return res.status(201).json({
      success:true,
      message:"Music created successfully",
      music
    });

  }catch(err){
    console.log("createMusic error:",err);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

// CREATE ALBUM
async function createAlbum(req,res){
  try{
    const {title,musics}=req.body;

    if(!title || !title.trim()){
      return res.status(400).json({
        success:false,
        message:"Title is required"
      });
    }

    const album=await albumModel.create({
      title:title.trim(),
      artist:req.user.id,
      musics:Array.isArray(musics)?musics:[]
    });

    return res.status(201).json({
      success:true,
      message:"Album created successfully",
      album
    });

  }catch(err){
    console.log("createAlbum error:",err);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

// GET ALL MUSICS
async function getAllMusics(req,res){
  try{
    const musics=await musicModel
      .find({})
      .limit(100)
      .populate("artist","username email");

    return res.status(200).json({
      success:true,
      musics
    });

  }catch(err){
    console.log("getAllMusics error:",err);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

// Get MY MUsic
async function getMyMusics(req,res){
  try{
    const musics = await musicModel
      .find({
        artist:req.user.id
      })
      .populate("artist","username email");

    return res.status(200).json({
      success:true,
      musics
    });

  }catch(err){
    console.log("getMyMusics error:",err);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

// GET ALL ALBUMS
async function getAllAlbums(req,res){
  try{
    const albums=await albumModel
      .find({})
      .populate("artist","username email");

    return res.status(200).json({
      success:true,
      albums
    });

  }catch(err){
    console.log("getAllAlbums error:",err);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

// GET ALBUM BY ID
async function getAlbumById(req,res){
  try{
    const {albumId}=req.params;

    const album=await albumModel
      .findById(albumId)
      .populate("artist","username email")
      .populate("musics");

    if(!album){
      return res.status(404).json({
        success:false,
        message:"Album not found"
      });
    }

    return res.status(200).json({
      success:true,
      album
    });

  }catch(err){
    console.log("getAlbumById error:",err);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

// DELETE MUSIC
async function deleteMusic(req,res){
  try{
    const musicId=req.params.id;

    const music=await musicModel.findById(musicId);

    if(!music){
      return res.status(404).json({
        success:false,
        message:"Music not found"
      });
    }

    if(String(music.artist) !== String(req.user.id)){
      return res.status(403).json({
        success:false,
        message:"You cannot delete this song"
      });
    }

    await musicModel.findByIdAndDelete(musicId);

    return res.status(200).json({
      success:true,
      message:"Music deleted successfully"
    });

  }catch(err){
    console.log("deleteMusic error:",err);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

module.exports={
  createMusic,
  createAlbum,
  getAllMusics,
  getMyMusics,
  getAllAlbums,
  getAlbumById,
  deleteMusic
};