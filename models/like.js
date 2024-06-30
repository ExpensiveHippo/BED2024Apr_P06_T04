const SQL = require("mssql");
const DBCONFIG = require("../dbConfig");

class Like {
    constructor(userId, contentType, contentId) {
        this.userId = userId;
        this.contentType = contentType;
        this.contentId = contentId;
    }

    // Create a like when user likes a post/comment
    static async createLike(newLike) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `INSERT INTO Likes (userId, contentType, contentId) VALUES (@userId, @contentType, @contentId);`;
            const request = connection.request();
            request.input("userId", newLike.userId);
            request.input("contentType", newLike.contentType);
            request.input("contentId", newLike.contentId);
            const result = await request.query(sqlQuery);
            connection.close();
            return this.getLike(newLike);
        } 
        catch (error) {
            console.error(error);
        }
        finally {
            if (connection) {
                connection.close();
            }
        } 
    }

    // Delete like when user unlikes a post/comment
    static async deleteLike(thisLike) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `DELETE FROM Likes WHERE userId = @userId AND contentType = @contentType AND contentId = @contentId`;
            const request = connection.request();
            request.input("userId", thisLike.userId);
            request.input("contentType", thisLike.contentType)
            request.input("contentId", thisLike.contentId);
            const result = await request.query(sqlQuery);
            return result.rowsAffected > 0;
        } 
        catch (error) {
            console.error(error);
        } 
        finally {
            connection.close();
        }
    }

    static async getLike(thisLike) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `SELECT * FROM Likes WHERE userId = @userId AND contentType = @contentType AND contentId = @contentId`
            const request = connection.request();
            request.input("userId", thisLike.userId);
            request.input("contentType", thisLike.contentType)
            request.input("contentId", thisLike.contentId);
            const result = await request.query(sqlQuery); 
            return result.recordset[0] ? new Like(
                result.recordset[0].userId,
                result.recordset[0].contentType,
                result.recordset[0].contentId
            ) : null;
        }
        catch (error) {
            console.error(error);
        }
        finally {
            connection.close();
        }
    }

    // Retrieve all the likes a post/comment has
    static async getLikesForContent(contentType, contentId) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `SELECT * FROM Likes WHERE contentType = ${contentType} AND contentId = ${contentId}`;      
            const result = await connection.request().query(sqlQuery);
            return result.recordset[0] ? result.recordset.map(row => {
                new Like(
                    row.userId,
                    row.contentType,
                    row.contentId
                )
            }) : null;
        } 
        catch (error) {
            console.error(error)
        }
        finally {
            connection.close();
        }
    }

    // Retrieve all the likes a user has
    static async getLikesOfUser(userId) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `SELECT * FROM Likes WHERE userId = ${userId}`; 
            const result = await connection.request().query(sqlQuery);
            return result.recordset[0] ? result.recordset.map(row => {
                new Like(
                    row.userId,
                    row.contentType,
                    row.contentId
                )
            }) : null;
        } 
        catch (error) {
            console.error(error)
        }
        finally {
            connection.close();
        }
    }
}

module.exports = Like;