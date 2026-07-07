const User = require("../models/user.model");
const jwt = require("jsonwebtoken");



exports.becomeArtist = async(req,res)=>{


    try{


        const user = await User.findById(
            req.user.id
        );


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }



        user.role="artist";


        await user.save();



        const token = jwt.sign(

            {
                id:user._id,
                role:user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }

        );



        res.json({

            message:"Now you are artist",

            user,

            token

        });



    }catch(error){


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }


};
