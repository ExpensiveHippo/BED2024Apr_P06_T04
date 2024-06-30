const express = require('express');
const bodyParser = require('body-parser');
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const path = require('path');

const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const likeController = require("./controllers/likeController");

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

app.post("/createPost", postController.createPost);
app.post('/login', userController.login);
app.post('/register', userController.register);
app.post('/like', likeController.createLike);

app.delete('/unlike', likeController.deleteLike);


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
