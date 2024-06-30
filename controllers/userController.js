const User = require("../models/user");

const login = async(req,res) =>{
    const { username, password } = req.body;
    try{
        const user = await User.getUserByUsername(username);
        if (user){
            if (password === user.password){
                res.json({ success:true, id:user.id });
            }
            else{
                res.json({ success: false});
            }
        }
        else{
            res.json({ sucess: false});
            console.log("Invalid");
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Error fetching User"});
    }
};
const register = async(req,res) =>{
    const newUserData = req.body;
    try{
        const newUser = await User.createUser(newUserData);
        if (newUser) {
            res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
        } 
        else {
            res.status(500).json({ success: false, message: "Failed to register user" });
        }
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