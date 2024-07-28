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
        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool.request().query(`
                SELECT C.commentId, C.userId, C.contentType, C.contentId, C.content, U.username
                FROM Comments C
                JOIN Users U ON C.userId = U.id
            `);
            return result.recordset;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
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
    static async updateComment(commentId, content) {
        try {
            let pool = await sql.connect(dbConfig);
            let result = await pool.request()
                .input('commentId', sql.Int, commentId)
                .input('content', sql.Text, content)
                .query('UPDATE Comments SET content = @content WHERE commentId = @commentId');
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Error updating comment: ", error);
            throw error;
        }
    }    

    static async createComment(userId, contentType, contentId, content) {
        try {
            let pool = await sql.connect(dbConfig);
            let result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('contentType', sql.VarChar, contentType)
                .input('contentId', sql.Int, contentId)
                .input('content', sql.Text, content)
                .query('INSERT INTO Comments (userId, contentType, contentId, content) VALUES (@userId, @contentType, @contentId, @content)');
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Error creating comment: ", error);
            throw error;
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