const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const userModel = require("../models/user.model");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req,res){
  try{
    const { title } = req.body;
    if(!title || !title.trim()){
      return res.status(400).json({
        success:false,
        message:"Title is required"
      });
    }
    const musicFile = req.files?.music?.[0];
    const imageFile = req.files?.image?.[0];
    if(!musicFile){
      return res.status(400).json({
        success:false,
        message:"Music file is required"
      });
    }
    const musicUpload = await uploadFile(
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
        const imageUpload = await uploadFile(
          imageFile.buffer.toString("base64")
        );
        imageUrl=imageUpload?.url || "";
      }catch(err){
        console.log("Image upload failed:",err.message);
      }
    }
    const music = await musicModel.create({
      title:title.trim(),
      uri:musicUpload.url,
      image:imageUrl,
      artist:req.user.id
    });
    res.status(201).json({
      success:true,
      message:"Music created successfully",
      music
    });
  }catch(err){
    console.log("createMusic error:",err);
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

async function createAlbum(req,res){
  try{
    const { title,musics }=req.body;
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
    res.status(201).json({
      success:true,
      message:"Album created successfully",
      album
    });
  }catch(err){
    console.log("createAlbum error:",err);
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
}

async function getAllMusics(req,res){
  try{
    const musics=await musicModel
      .find({})
      .limit(100)
      .populate("artist","username email");
    res.status(200).json({
      success:true,
      musics
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"Internal Server Error"
    });
  }
}

async function getMyMusics(req,res){
  try{
    const musics=await musicModel
      .find({
        artist:req.user.id
      })
      .populate("artist","username email");
    res.status(200).json({
      success:true,
      musics
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"Internal Server Error"
    });
  }
}

async function getAllAlbums(req,res){
  try{
    const albums=await albumModel
      .find({})
      .populate("artist","username email");
    res.status(200).json({
      success:true,
      albums
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"Internal Server Error"
    });
  }
}

async function getAlbumById(req,res){
  try{
    const { albumId }=req.params;
    const album=await albumModel
      .findById(albumId)
      .populate("artist","username email")
      .populate("musics");
    if(!album){
      return res.status(404).json({
        message:"Album not found"
      });
    }
    res.status(200).json({
      success:true,
      album
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"Internal Server Error"
    });
  }
}

async function deleteMusic(req,res){
  try{
    const music=await musicModel.findById(req.params.id);
    if(!music){
      return res.status(404).json({
        message:"Music not found"
      });
    }
    if(String(music.artist)!==String(req.user.id)){
      return res.status(403).json({
        message:"You cannot delete this song"
      });
    }
    await musicModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message:"Music deleted successfully"
    });
  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"Internal Server Error"
    });
  }
}

async function addRecentlyPlayed(req,res){
  try{
    const userId = req.user.id;
    const songId = req.params.songId;

    console.log("USER ID:", userId);
    console.log("SONG ID:", songId);

    const user = await userModel.findById(userId);

    console.log("USER FOUND:", user);

    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }

    user.recentlyPlayed = user.recentlyPlayed || [];

    user.recentlyPlayed = user.recentlyPlayed.filter(
      id => id.toString() !== songId
    );

    user.recentlyPlayed.unshift(songId);

    user.recentlyPlayed = user.recentlyPlayed.slice(0,10);

    await user.save();

    console.log("UPDATED USER:", user);

    res.status(200).json({
      message:"Recently played updated"
    });

  }catch(error){
    console.log("RECENT ERROR:",error);

    res.status(500).json({
      message:error.message
    });
  }
}

async function getRecentlyPlayed(req,res){
  try{
    const loggedInUser=await userModel
      .findById(req.user.id)
      .populate({
        path:"recentlyPlayed",
        populate:{
          path:"artist",
          select:"username"
        }
      });
    if(!loggedInUser){
      return res.status(404).json({
        message:"User not found"
      });
    }
    res.status(200).json({
      songs:loggedInUser.recentlyPlayed || []
    });
  }catch(err){
    console.log("getRecentlyPlayed error:",err);
    res.status(500).json({
      message:err.message
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
  deleteMusic,
  addRecentlyPlayed,
  getRecentlyPlayed
};