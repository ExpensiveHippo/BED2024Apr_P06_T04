const express = require('express');
const bodyParser = require('body-parser');
const userController = require("./controllers/userController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");


const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const likeController = require("./controllers/likeController");
const commentController = require("./controllers/commentController");
const authenticateToken = require('./middleware/authUser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // serve static files (HTML, CSS, JS)



// Endpoints
app.get("/Posts",postController.getAllPosts)
app.get("/Posts/:postId",postController.getPostById)
app.get("/like/:userId/:contentType/:contentId", likeController.getLike);
app.get("/Comments",commentController.getAllComments)
app.get("/Comments/:userId",commentController.getCommentsByUser)
app.get("/Profile",authenticateToken,userController.getProfile);

app.post("/createPost", postController.createPost);
app.post('/login', userController.login);
app.post('/register', userController.register);
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','dashboard.html'));
});

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
