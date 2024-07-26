const express = require('express');
const bodyParser = require('body-parser');
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const path = require('path');

const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const likeController = require("./controllers/likeController");
const commentController = require("./controllers/commentController");
const reportController = require("./controllers/reportController");
const authenticateToken = require("./middleware/authUser");
const { report } = require('process');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // serve static files (HTML, CSS, JS)


// Endpoints
app.get("/Posts",postController.getAllPosts);
app.get("/Posts/:postId",postController.getPostById);
app.get("/Comments",commentController.getAllComments);
app.get("/Comments/:userId",commentController.getCommentsByUser);
app.get("/like/:contentType/:contentId", authenticateToken, likeController.getLike);


app.post("/createPost", postController.createPost);
app.post('/login', userController.login);
app.post('/register', userController.register);
app.post('/like', authenticateToken, likeController.createLike);
app.post('/createComment', commentController.createComment);
app.post('/createReport', authenticateToken, reportController.createReport);

app.delete('/unlike', authenticateToken, likeController.deleteLike);
app.delete('/deleteReport/:reportId', authenticateToken, reportController.deleteReportById);
app.delete('/deleteReports/:contentType/:contentId', authenticateToken, reportController.deleteReportsByContentId);


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
