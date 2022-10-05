import User from "../models/User.js"
import generateToken from "../utils/generateToken.js";

//@desc: login user
//route: POST /api/v1/users/login
//access: public
const userLogin = async(req,res) => {
    const {emailOrUsername, password} = req.body;
    console.log(emailOrUsername, password)
    try{
        let user = await User.findOne({email:emailOrUsername})
        if(!user){
            user = await User.findOne({username:emailOrUsername})
            if(!user){
                res.status(404)
                throw new Error('User does not exist, pls register')
            }
        } 
 
        //if user exist
        if(user && (await user.matchedPassword(password))){
            res.status(202).json({
                status:'success',
                user:{
                    _id:user._id,
                    email:user.email,
                    username:user.username,
                    role:user.role,
                    token: await generateToken(user._id)
                }
            })
        }else{
            res.status(400)
            throw new Error('Incorrect password')
        }

    }catch(err){
        res.status(400).json({
            status:'error',
            message: err.message
        })
    }
}

//@desc: register user 
//route: POST /api/v1/users/register
//access: public
const registerUser = async(req,res) => {
    const {email, username, password} = req.body;
    try{
        let userEmailExist = await User.findOne({email:email})
        let userUsernameExist = await User.findOne({username:username})

        //if user exist
        if(userEmailExist){
            res.status(400)
            throw new Error('Email already registered')
        }

        if(userUsernameExist){
            res.status(400)
            throw new Error('Username already taken, please choose a unique username')
        }

        const user = await User.create({
            email,
            username:username ? username.trim().toLowerCase() : '',
            password
        })

        res.status(201).json({
            status:'success',
            user:{
                _id:user._id,
                email:user.email,
                username:user.username,
                role:user.role,
            }
        })

    }catch(err){
        res.status(400).json({
            status:'error',
            message: err.message
        })
    }
}

//@desc: get users
//route: GET /api/v1/users
//access: private
const getUsers = async(req,res)=> {
    try{
        const users = await User.find({}).sort({_id:-1}).select('-password')
        res.status(200).json({
            status:'success',
            users
        })

    }catch(err){
        res.status(400).json({
            status:'error',
            message: err.message
        })
    }
}

//@desc: get user profile
//route: GET /api/v1/users/profile 
//access: private
const getUserProfile = async(req,res)=> {
    try{ 
        const user = await User.findById({_id:req.user._id}).select('-password')
        if(!user){
            res.status(404)
            throw new Error('No User with associated record found')
        }

        res.status(200).json({
            status:'success',
            user
        })

    }catch(err){
        res.status(400).json({
            status:'error',
            message: err.message
        })
    }
}

export {
    userLogin,
    registerUser,
    getUsers,
    getUserProfile
}