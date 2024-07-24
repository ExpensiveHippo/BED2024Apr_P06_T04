const User = require("../models/user");
const bcrypt = require('bcrypt');

const login = async(req,res) =>{
    const { username, password } = req.body;
    try{
        const user = await User.getUserByUsername(username);
        if (user){
            if (!await bcrypt.compare(password, user.password)){
                return res.status(401).json({message: "Invalid Credentials" , success : false});
            }
            return res.json({success: true, user});
        }
        else{
            return res.status(401).json({message: "Invalid Credentials" , success : false});
        }
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
        res.status(201).json({success: true, user: newUser});
    }
    catch (error){
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
}
module.exports = {
    login,
    register,
}