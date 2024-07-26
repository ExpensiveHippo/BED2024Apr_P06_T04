const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Comments {
    constructor(commentId, userId, contentType, contentId, content, username) {
        this.commentId = commentId;
        this.userId = userId;
        this.contentType = contentType;
        this.contentId = contentId;
        this.content = content;
        this.username= username;
    }

    static async getAllComments() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT c.commentId, c.content,u.username FROM Comments c INNER JOIN Users u ON c.userId = u.id;`;
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
    }/*
    static async updateComment(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Books SET title = @title, author = @author WHERE id = @id`; // Parameterized query

        const request = connection.request();
        request.input("id", id);
        request.input("title", newBookData.title || null); // Handle optional fields
        request.input("author", newBookData.author || null);

        await request.query(sqlQuery);

        connection.close();

        return this.getBookById(id); // returning the updated book data
    }
    static async deleteComment(id) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `DELETE FROM Comments WHERE commentId = @id`;
            const request = connection.request();
            request.input("id", id);
            const result = await request.query(sqlQuery);
            connection.close();
            console.log(`Result of delete query: ${result.rowsAffected}`);
            return result.rowsAffected > 0; // Indicate success based on affected rows
        } catch (error) {
            console.error("Error in deleteComment model:", error);
            throw error;
        }
    }*/
    static async deleteComment(id) {
        try {
            console.log(`Deleting comment with ID: ${id}`);
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `DELETE FROM Comments WHERE commentId = @id`;
            const request = connection.request();
            request.input("id", id);
            const result = await request.query(sqlQuery);
            connection.close();
            console.log(`Rows affected: ${result.rowsAffected}`);
            if (result.rowsAffected > 0) {
            return "Comment deleted successfully";}
        } catch (error) {
            console.error("Error in deleteComment model:", error);
            throw error;
        }
    }

  

    static async createComment(postId, userId, comment, liked = false) {
        const connection = await sql.connect(dbConfig);
    
        // Assuming 'liked' defaults to false and 'Comments' table has an auto-increment 'commentId'
        const sqlQuery = `
            INSERT INTO Comments (postId, userId, comment, liked)
            OUTPUT INSERTED.commentId, INSERTED.comment
            VALUES (@postId, @userId, @comment, @liked);
        `;
    
        const request = connection.request();
        request.input('postId', sql.Int, postId);
        request.input('userId', sql.Int, userId);
        request.input('comment', sql.NVarChar(sql.MAX), comment);
        request.input('liked', sql.Bit, liked);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        // Assuming the result contains the inserted 'commentId' and 'comment'
        if (result.recordset.length > 0) {
            return {
                commentId: result.recordset[0].commentId,
                comment: result.recordset[0].comment
            };
        } else {
            throw new Error('Failed to create comment');
        }
    }
}

module.exports = Comments;