const express = require('express');
const bodyParser = require('body-parser');
const userController = require("./controllers/userController");
const postController = require("./controllers/postController")
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const path = require('path');
const cors = require('cors'); // Allow cross-origin requests if needed

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static('public')); // serve static files (HTML, CSS, JS)


//Endpoint
app.get("/Posts",postController.getAllPosts)
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