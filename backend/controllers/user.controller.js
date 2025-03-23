import User from "../models/user.model.js";
import { createUser, getAllUsers } from "../services/user.service.js";

import redisClient from "../services/redis.service.js";

import {validationResult} from 'express-validator';

export const createUserController = async(req, res) => {
    const errors = validationResult(req) ;

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    try{
        const user = await createUser(req.body);

        const token = await user.generateJWT() ;

        delete user._doc.password ;

        res.status(200).send({user, token}) ;
    }
    catch(error){
        res.status(400).send(error.message) ;
    }
}

export const loginController = async(req, res) => {
    const errors = validationResult(req) ;

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    try{
        const {email, password} = req.body ;
        const user = await User.findOne({email}) ;
        if(!user){
            return res.status(404).json({message: "User not found"}) ;
        }        
        
        const isMatch = await user.isValidPassword(password) ;
        if(!isMatch){
            return res.status(401).json({message: "Invalid credentials"}) ;
        }
        
        
        const token = await user.generateJWT() ;

        delete user._doc.password ;
 
        res.status(200).send({user, token}) ;
    }
    catch(error){
        res.status(400).send(error.message) ;
    }
}

export const profileController = async (req, res) => {
    console.log(req.user) ;
    res.status(200).json({user: req.user}) ;
}


export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1] ;
        redisClient.set(token, 'logout', 'EX', 60*60*24);     // jab token expire ho jaega to token redis me store
        res.status(200).json({message: 'Logged Out Successfully'}) ;
    }
    catch(error){
        console.log(error);
        res.status(400).send(error.message) ;
    }
}

export const getAllUserController = async (req, res) => {
    try{
        const loggedInUser = await User.findOne({email: req.user.email}) ;
        const allUsers = await getAllUsers({userId: loggedInUser._id}) ;
        res.status(200).json({users: allUsers}) ;
    }
    catch(error){
        res.status(400).send(error.message) ;
    }
}