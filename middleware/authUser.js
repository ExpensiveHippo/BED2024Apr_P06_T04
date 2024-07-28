const jwt = require('jsonwebtoken');

require('dotenv').config();

const authenticateToken = (req,res,next) =>{
    const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1]; // Authorization: "Bearer <TOKEN>"

    if (!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if (err) {
            console.error(err);
            return res.status(403).json({message: "Forbidden"});
        }
        const authorizedRoles = {
            // TODO: endpoints to be placed here for authorization of certain things
            "/createPost": ["admin","user"],
            "/getUser": ["admin","user"],
            "/updatePost/[0-99]": ["admin","user"],

        }

        const requestedEndPoint = req.url; 
        const userRole = user.role;

        const authorizedRole = Object.entries(authorizedRoles).find(
            ([endpoint, roles]) => {
              const regex = new RegExp(`^${endpoint}$`);
              return regex.test(requestedEndPoint) && roles.includes(userRole);
            }
        )
      
    

        if (!authorizedRole) {
        return res.status(403).json({ message: "Forbidden 3" });
        }
    
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;