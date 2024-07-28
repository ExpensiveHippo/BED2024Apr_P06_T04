const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Comments {
    constructor(commentId, userId, contentType, contentId, content) {
        this.commentId = commentId;
        this.userId = userId;
        this.contentType = contentType;
        this.contentId = contentId;
        this.content = content;
    }

    static async getAllComments() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT c.userId, c.commentId, c.content,u.username FROM Comments c INNER JOIN Users u ON c.userId = u.id;`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => ({
            commentId: row.commentId,
            content: row.content,
            username: row.username
        }));
    }

    static async getCommentsByUser(userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT c.commentId, c.content,u.username FROM Comments c INNER JOIN Users u ON c.userId = u.id WHERE userId = @userId`;
        const request = connection.request();
        request.input('userId', sql.Int, userId);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => ({
            commentId: row.commentId,
            content: row.content,
            username: row.username
        }));
    }    
    
    static async createComment(newComment) {
        const connection = await sql.connect(dbConfig);
        try {
            // Insert the comment
            const insertQuery = `
                INSERT INTO Comments (userId, contentType, contentId, content)
                VALUES (@userId, @contentType, @contentId, @content)
            `;
            const request = connection.request();
            request.input("userId", sql.Int, newComment.userId);
            request.input("contentType", sql.VarChar, newComment.contentType);
            request.input("contentId", sql.Int, newComment.contentId);
            request.input("content", sql.VarChar, newComment.content);
    
            await request.query(insertQuery);
    
            // Retrieve the last inserted ID
            const idQuery = `SELECT SCOPE_IDENTITY() AS commentId`;
            const result = await request.query(idQuery);
            const commentId = result.recordset[0].commentId;
    
            // Fetch the inserted comment details
            return this.getCommentById(commentId);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }
    
    

    static async deleteComment(id) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Comments WHERE commentId = @id`;
        const request = connection.request();
        request.input("id", sql.Int, id);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.rowsAffected[0] > 0;
    }

    static async createComment(newComment) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `INSERT INTO Comments (userId, contentType, contentId, content)
                              OUTPUT Inserted.commentId
                              VALUES (@userId, @contentType, @contentId, @content)`;
            const request = connection.request();
            request.input("userId", sql.Int, newComment.userId);
            request.input("contentType", sql.VarChar, newComment.contentType);
            request.input("contentId", sql.Int, newComment.contentId);
            request.input("content", sql.Text, newComment.content);
            const result = await request.query(sqlQuery);
            connection.close();

            if (result.recordset.length > 0) {
                return this.getCommentsByUser(result.recordset[0].commentId);
            } else {
                throw new Error('Failed to create comment');
            }
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }
}

module.exports = Comments;
