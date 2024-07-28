const SQL = require("mssql");
const DBCONFIG = require("../dbConfig");

class Like {
    constructor(likeId, userId, contentType, contentId) {
        this.likeId = likeId;
        this.userId = userId;
        this.contentType = contentType;
        this.contentId = contentId;
    }

    // Create a like when user likes a post/comment
    static async createLike(user, body) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `INSERT INTO Likes (userId, contentType, contentId) VALUES (@userId, @contentType, @contentId);
            SELECT SCOPE_IDENTITY() AS likeId;`;
            const request = connection.request();
            request.input("userId", user.id);
            request.input("contentType", body.contentType);
            request.input("contentId", body.contentId);
            const result = await request.query(sqlQuery);
            connection.close();
            return this.getLikeById(result.recordset[0].likeId);
        } 
        catch (error) {
            console.error(error);
            throw(error);
        }
        finally {
            if (connection) {
                connection.close();
            }
        } 
    }

    // Delete like when user unlikes a post/comment
    static async deleteLike(user, body) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `DELETE FROM Likes WHERE userId = @userId AND contentType = @contentType AND contentId = @contentId`;
            const request = connection.request();
            request.input("userId", user.id);
            request.input("contentType", body.contentType)
            request.input("contentId", body.contentId);
            const result = await request.query(sqlQuery);
            return result.rowsAffected > 0;
        } 
        catch (error) {
            console.error(error);
            throw error;
        } 
        finally {
            connection.close();
        }
    }

    static async getLike(user, contentType, contentId) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `SELECT * FROM Likes WHERE userId = @userId AND contentType = @contentType AND contentId = @contentId`;
            const request = connection.request();
            request.input('userId', user.id);
            request.input('contentType', contentType);
            request.input('contentId', contentId);
            const result = await request.query(sqlQuery); 
            return result.recordset[0] ? new Like(
                result.recordset[0].likeId,
                result.recordset[0].userId,
                result.recordset[0].contentType,
                result.recordset[0].contentId
            ) : null;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            connection.close();
        }
    }

    static async getLikeById(id) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `SELECT * FROM Likes WHERE likeId = @likeId`;
            const request = connection.request();
            request.input('likeId', id);
            const result = await request.query(sqlQuery); 
            return result.recordset[0] ? new Like(
                result.recordset[0].likeId,
                result.recordset[0].userId,
                result.recordset[0].contentType,
                result.recordset[0].contentId
            ) : null;
        }
        catch (error) {
            console.error(error);
            throw error;
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
                    row.likeId,
                    row.userId,
                    row.contentType,
                    row.contentId
                )
            }) : null;
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            connection.close();
        }
    }

    // Retrieve all the likes a user has
    static async getLikesOfUser(user) {
        const connection = await SQL.connect(DBCONFIG);
        try {
            const sqlQuery = `SELECT * FROM Likes WHERE userId = @userId`; 
            const request = connection.request();
            request.input("userId", user.id);
            return result.recordset[0] ? result.recordset.map(row => {
                new Like(
                    row.likeId,
                    row.userId,
                    row.contentType,
                    row.contentId
                )
            }) : null;
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            connection.close();
        }
    }
}

module.exports = Like;