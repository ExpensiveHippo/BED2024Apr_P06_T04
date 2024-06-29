const express = require('express');
const bodyParser = require('body-parser');
const userController = require("./controllers/userController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // serve static files (HTML, CSS, JS)


//Endpoint
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
