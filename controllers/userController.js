const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const getProfile = async (req,res) =>{
    try{
        const username = req.user.username;
        const profileUser = await User.getUserByUsername(username);
        if (!profileUser){
            return res.status(404).json({message: "User not found", success: false });
        }
        res.json({success: true, user: {username: profileUser.username,
                                        email: profileUser.email,
                                        role: profileUser.role}});
    }
    catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Error fetching user profile', success: false });
    }
}

const login = async(req,res) =>{
    const { username, password } = req.body;
    try{
        const user = await User.getUserByUsername(username);
        if (!user){
            return res.status(401).json({message: "Invalid Credentials" , success : false});
        }
        if (!await bcrypt.compare(password, user.password)){
            return res.status(401).json({message: "Invalid Credentials 2" , success : false});
        }

        const userInfo = {
            username: user.username,
            role: user.role,
        }
        const authToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
        res.json({success: true, accessToken: authToken});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Error fetching User"});
    }
};
const register = async(req,res) =>{
    const { username, email, password, role} = req.body;
    try{
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({message: "Username already exists! Please try again!"})
        } 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUserData = { username, email, password : hashedPassword, role};

        const newUser =  await User.createUser(newUserData);
        if (!newUser){
            return res.status(500).json({message: "Failed to register User", success: false});
        }
        // authToken generation
        userInfo = {
            username: newUser.username,
            role: newUser.role,
        }
        const authToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
        res.status(201).json({success: true, accessToken: authToken});
    }
    catch (error){
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
}
module.exports = {
    login,
    register,
    getProfile,
}