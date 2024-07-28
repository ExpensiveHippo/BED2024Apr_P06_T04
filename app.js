const express = require('express');
const bodyParser = require('body-parser');
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const likeController = require("./controllers/likeController");
const commentController = require("./controllers/commentController");
const authenticateToken = require('./middleware/authUser');
const validateUser = require("./middleware/joiUser");
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // serve static files (HTML, CSS, JS)


// Endpoints/Routes
app.get("/Posts",postController.getAllPosts);
app.get("/Posts/:postId",postController.getPostById);
app.get("/like/:userId/:contentType/:contentId", likeController.getLike);
app.get("/Comments",commentController.getAllComments)
app.get("/Comments/:userId",commentController.getCommentsByUser)
app.get("/getUser",authenticateToken,userController.getSignedInProfile);
app.get("/getSearchedProfile/:username", userController.getSearchedProfile);
app.get("/getAllUsers",userController.getAllUsernames);



app.post("/createPost",authenticateToken, postController.createPost);
app.post('/login', userController.login);
app.post('/register', validateUser, userController.register);
app.post('/like', likeController.createLike);
app.post('/createComment', commentController.createComment);

app.put("/updatePost/:postId/:username", postController.updatePost)
app.put("/updateProfile",validateUser, authenticateToken, userController.updateProfile);
app.put("/updateComments/:id", commentController.updateComment); 

app.delete("/deleteComments/:id", commentController.deleteComment);
app.delete('/unlike', likeController.deleteLike);
app.delete('/deletePost/:postId/:username',postController.deletePost)
app.delete('/deleteProfile',authenticateToken,userController.deleteProfile);


// Start server
app.listen(port, async() => {
    try{
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");
    }
    catch(err){
        console.error("Database connection error: ", err);
        process.exit(1);
    }

    console.log(`Server running at http://localhost:${port}`);
});
process.on("SIGINT", async() =>{
    console.log("Server closing gracefully");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
})
