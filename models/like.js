const SQL = require("../mssql");
const DBCONFIG = require("../dbConfig");

class Like {
    constructor(userId, contentType, contentId) {
        this.userId = userId;
        this.contentType = contentType;
        this.contentId = contentId;
    }

    // Create a like when user likes a post/comment
    static async createLike(newLike) {
        try {
            const connection = await SQL.connect(DBCONFIG);
            const sqlQuery = `INSERT INTO Likes (userId, contentType, contentId) VALUES (@userId, @contentType, @contentId);`;
            const request = connection.request();
            request.input("userId", newLike.userId);
            request.input("contentType", newLike.contentType);
            request.input("contentId", newLike.contentId);
            const result = await request.query(sqlQuery);
            return this.getLike(newLike);
        } 
        catch (error) {
            console.error(error);
        }
        finally {
            connection.close();
        } 
    }

    // Delete like when user unlikes a post/comment
    static async deleteLike(thisLike) {
        try {
            const connection = await SQL.connect(DBCONFIG);
            const sqlQuery = `DELETE FROM Likes WHERE userId = @userId AND contentType = @contentType AND contentId = @contentId`;
            const request = connection.request();
            request.input("userId", thisLike.userId);
            request.input("contentType", thisLike.contentType)
            request.input("contentId", thisLike.contentId);
            const result = await request.query(sqlQuery);
            connection.close();
            return result.rowsAffected > 0;
        } 
        catch (error) {
            connection.close();
            console.error(error);
        } 
    }

    static async getLike(thisLike) {
        try {
            const connection = await SQL.connect(DBCONFIG);
            const sqlQuery = `SELECT * FROM Likes WHERE userId = @userId AND contentType = @contentType AND contentId = @contentId`
            const request = connection.request();
            request.input("userId", thisLike.userId);
            request.input("contentType", thisLike.contentType)
            request.input("contentId", thisLike.contentId);
            const result = await request.query(sqlQuery); 
            connection.close();
            return result.recordset[0] ? new Like(
                result.recordset[0].userId,
                result.recordset[0].contentType,
                result.recordset[0].contentId
            ) : null;
        }
        catch (error) {
            connection.close();
            console.error(error);
        }
    }

    // Retrieve all the likes a post/comment has
    static async getLikesForContent(contentType, contentId) {
        try {
            const connection = await SQL.connect(DBCONFIG);
            const sqlQuery = `SELECT * FROM Likes WHERE contentType = ${contentType} AND contentId = ${contentId}`;      
            const result = await connection.request().query(sqlQuery);
            connection.close();
            return result.recordset[0] ? result.recordset.map(row => {
                new Like(
                    row.userId,
                    row.contentType,
                    row.contentId
                )
            }) : null;
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
            return result.recordset[0] ? result.recordset.map(row => {
                new Like(
                    row.userId,
                    row.contentType,
                    row.contentId
                )
            }) : null;
        } 
        catch (error) {
            connection.close();
            console.error(error)
        }
    }
}

module.exports = Like;