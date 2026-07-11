const Playlist = require("../models/playlist.model");


// CREATE PLAYLIST


async function createPlaylist(req, res) {
  try {
    const { name } = req.body;

    const playlist = await Playlist.create({
      name,
      user: req.user.id,
      songs: []
    });

    res.status(201).json({
      message: "Playlist created successfully",
      playlist
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    });
  }
}




// GET USER PLAYLISTS

async function getMyPlaylists(req,res){

 try{

  const playlists = await Playlist.find({
    user:req.user.id
  }).populate("songs");


  res.json({
    playlists
  });


 }catch(error){

  res.status(500).json({
    message:error.message
  });

 }

};
async function addSongToPlaylist (req, res){
      try{

    const {playlistId, songId} = req.params;


    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: req.user.id
    });


    if(!playlist){
      return res.status(404).json({
        message:"Playlist not found"
      });
    }


    // duplicate check
    if(playlist.songs.includes(songId)){
      return res.status(400).json({
        message:"Song already added"
      });
    }


    playlist.songs.push(songId);

    await playlist.save();


    res.json({
      message:"Song added to playlist",
      playlist
    });


  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
}

// Delete Playlist
async function deletePlaylist(req,res){
  try{
    const playlist = await Playlist.findOne({
      _id:req.params.id,
      user:req.user.id
    });

    if(!playlist){
      return res.status(404).json({
        message:"Playlist not found"
      });
    }

    await Playlist.deleteOne({
      _id:req.params.id
    });

    res.json({
      message:"Playlist deleted successfully"
    });

  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
}

module.exports = {createPlaylist , getMyPlaylists , addSongToPlaylist, deletePlaylist}