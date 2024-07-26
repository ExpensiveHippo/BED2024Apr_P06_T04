const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Post{
    constructor(postId,username,title,content){
        this.postId=postId;
        this.username=username
        this.title=title
        this.content=content
    }
    static async getPostById(postId){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * from Posts where postId = @postId`;
        const request =  connection.request();
        request.input('postId',sql.Int,postId);
        const result =  await request.query(sqlQuery);
        connection.close();

        return result.recordset[0] 
        ? new Post(
            result.recordset[0].postId,
            result.recordset[0].username,
            result.recordset[0].title,
            result.recordset[0].content
        )
        : null;
    } 
    static async getAllPost(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * from Posts`;
        const request =  connection.request();
        const result =  await request.query(sqlQuery);
        connection.close();

        return result.recordset.map((row) => new Post(row.postId,row.username,row.title,row.content))
    } 
    static async createPost(newPostData){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Posts (username,title,content) VALUES(@username,@title,@content); SELECT SCOPE_IDENTITY() AS postId;`

        const request = connection.request();
        request.input('username',sql.VarChar,newPostData.username);
        request.input('title',sql.VarChar,newPostData.title);
        request.input('content',sql.VarChar,newPostData.content)

        const result = await request.query(sqlQuery);
        if (result.recordset.length === 0){
            throw new Error("Failed to create Post");
        }
        connection.close();
        return this.getPostById(newPostData.postId);
    }
}
module.exports = Post;