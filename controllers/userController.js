const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const getAllUsernames = async (req,res) =>{
    try{
        const usernameArray = await User.getAllUsers();
        res.json({success: true, usernameArray});
    }
    catch(err){
        console.error(err);
        res.status(500).json({success: false, message:'Error with fetching usernames'});
    }
}
// user searches a profile through the search engine
const getSearchedProfile = async (req,res) =>{
    try{
        const paramsUsername = req.params.username;
        console.log(paramsUsername);
        const searchedProfile = await User.getUserByUsername(paramsUsername);
        if(!searchedProfile){
            return res.status(404).json({message: "User not found", success: false});
        }
        res.json({success: true, user: {username: searchedProfile.username, email: searchedProfile.email, bio: searchedProfile.bio, link: searchedProfile.link, role: searchedProfile.role}});
    }
    catch(err){
        console.error('Error fetching searched user profile:', err);
        res.status(500).json({message: "Error fetching searched user profile", success: false});
    }
}
// signed-in user's profile
const getSignedInProfile = async (req,res) =>{
    try{
        const username = req.user.username;
        const profileUser = await User.getUserByUsername(username);
        if (!profileUser){
            return res.status(404).json({message: "User not found", success: false });
        }
        res.json({success: true, user: {username: profileUser.username, email: profileUser.email, bio: profileUser.bio, link: profileUser.link, role: profileUser.role}});
    }
    catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Error fetching user profile', success: false });
    }
}
const updateProfile = async (req,res) =>{
    try{
        const username = req.user.username;
        const currentUser = await User.getUserByUsername(username);
        const {newUsername, newEmail, newBio, newLink} = req.body;

        if (username !== newUsername){
            const existingUser = await User.getUserByUsername(newUsername)
            if(existingUser){
                return res.status(400).json({message: "Username already exists", success: false});
            }
        }
        const updatedUserData = {
            username: newUsername,
            email: newEmail,
            bio: newBio || null,
            link: newLink || null
        };
        const updatedUser = await User.updateUser(username, updatedUserData);
        const userInfo = {
            id: updatedUser.id,
            username: updatedUser.username,
            role: updatedUser.role,
        };
        const newAuthToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' });
        res.json({success:true, accessToken: newAuthToken});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Error updating User"});
    }
}
const deleteProfile = async(req,res) =>{
    const username = req.user.username;
    try{
        const success = await User.deleteUser(username);
        if(!success){
            return res.status(404).json({success: false, message: 'User not found'});
        }
        res.json({success: true, message: "User deleted successfully"});
    }
    catch(err){
        console.error('Error deleting user:', err);
        res.status(500).json({success:false, message: 'Server Error while deleting user'});
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
            id: user.id,
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
            id: newUser.id,
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
    getSignedInProfile,
    getSearchedProfile,
    getAllUsernames,
    updateProfile,
    deleteProfile,
}