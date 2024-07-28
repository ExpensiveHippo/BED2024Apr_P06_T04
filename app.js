const express = require('express');
const bodyParser = require('body-parser');
const sql = require("mssql");
const dbConfig = require("./dbConfig");


const authenticateToken = require('./middleware/authUser');

const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const likeController = require("./controllers/likeController");
const commentController = require("./controllers/commentController");
const authenticateToken = require('./middleware/authUser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // serve static files (HTML, CSS, JS)


// Endpoints
app.get("/Posts",postController.getAllPosts)
app.get("/Posts/:postId",postController.getPostById)
app.get("/like/:userId/:contentType/:contentId", likeController.getLike);
app.get("/Comments",commentController.getAllComments)
app.get("/Comments/:userId",commentController.getCommentsByUser)
app.get("/getUser",authenticateToken,userController.getProfile);



app.post("/createPost",authenticateToken, postController.createPost);
app.post('/login', userController.login);
app.post('/register', userController.register);
app.post('/like', likeController.createLike);
app.post('/createComment', commentController.createComment);

app.put("/updatePost/:postId",authenticateToken, postController.updatePost)

app.delete('/unlike', likeController.deleteLike);
app.delete('/deletePost/:postId',postController.deletePost)


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
