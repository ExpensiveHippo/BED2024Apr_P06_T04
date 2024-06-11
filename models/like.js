const SQL = require("../mssql");
const DBCONFIG = require("../dbConfig");

class Like {
    constructor(userId, postId) {
        this.userId = userId;
        this.postId = postId;
    }

    // Create a like when user likes a post
    static async createLike(newLike) {
        try {
            const connection = await SQL.connect(DBCONFIG);

            const sqlQuery = `INSERT INTO Likes (userId, postId) VALUES (@userId, @postId);`;

            const request = connection.request();
            request.input("userId", newLike.userId);
            request.input("postId", newLike.postId);

            const result = await request.query(sqlQuery);
        } 
        catch (error) {
            console.error(error);
        }
        finally {
            connection.close();
        }
        
    }

    // Delete like when user unlikes a post
    static async deleteLike(thisLike) {
        try {
            const connection = await SQL.connect(DBCONFIG);

            const sqlQuery = `DELETE FROM Likes WHERE userId = @userId AND postId = @postId`;

            const request = connection.request();
            request.input("userId", thisLike.userId);
            request.input("postId", thisLike.postId);

            const result = await request.query(sqlQuery);

            connection.close();
            return result.rowsAffected > 0;
        } 
        catch (error) {
            connection.close();
            console.error(error);
        } 
    }

    // Retrieve all the likes a post has
    static async getLikesForPost(postId) {
        try {
            const sqlQuery = `SELECT * FROM Likes WHERE postId = ${postId}`;
            
            const connection = await SQL.connect(DBCONFIG);
            const result = await connection.request().query(sqlQuery);
    
            connection.close();
            return result.recordset;
        } 
        catch (error) {
            connection.close();
            console.error(error)
        }
    }

    // Retrieve all the likes a user has
    static async getLikesOfUser(userId) {
        try {
            const sqlQuery = `SELECT * FROM Likes WHERE userId = ${userId}`;
            
            const connection = await SQL.connect(DBCONFIG);
            const result = await connection.request().query(sqlQuery);
    
            connection.close();
            return result.recordset;
        } 
        catch (error) {
            connection.close();
            console.error(error)
        }
    }
}

module.exports = Like;