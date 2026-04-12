const userModel= require("../models/user.model.js");
const bcrypt=require("bcryptjs");
const jwt= require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model.js");

/**
 * @name registerUserController
 * @description register a new user, expects username,email nd pass in req. body
 * @access Public
 */
async function registerUserController(req,res){
    const{username,email,password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username,e-mail,password"
        })
    }

    const isUserAlreadyExists=await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"Account already exists with this email address or username"
        })
    }

    const hash=await bcrypt.hash(password,10);
    const user=await userModel.create({
        username,
        email,
        password:hash
    })

    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)
    res.status(201).json({
        message:"User registered succesfully",
        user:{
            id:user._id,
            username: user.username,
            email:user.email
        }
    })
}

/**
 * @name loginUserController
 * @description Login a user, expexts mail and pass in req. body
 * @access Public
*/
async function loginUserController(req,res){
    const {email,password}=req.body;
    const user= await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
     if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token", token);
    res.status(200).json({
        message:"User Logged in Successfully",
        user:{
            id:user._id,
            username: user.username,
            email:user.email,
        }
    })
}

/**
 * @name logoutUserController
 * @description Logout user and blacklist token
 * @access Public
*/
async function logoutUserController(req,res){
    const token=req.cookies.token;

    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token");
    res.status(200).json({
        message:"User logout successfully",
    })
}

/**
 * @name getMeController
 * @description get the current data of loggedin user
 * @access Private
*/
async function getMeController(req,res){
    const user=await userModel.findById(req.user.id);
    res.status(200).json({
        message:"User details fetched successfully.",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })
}

module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}