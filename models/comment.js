const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Comments {
    constructor(commentId, postId, userId, comment, liked) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.comment = comment;
        this.liked = liked;
    }

    static async getAllComments() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comments`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new Comments(row.commentId, row.postId, row.userId, row.comment, row.liked));
    }

    static async getCommentsByUser(userId) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Comments WHERE userId = @userId`;
        const request = connection.request();
        request.input('userId', sql.Int, userId);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new Comments(row.commentId, row.postId, row.userId, row.comment, row.liked));
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