const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User{
    constructor(id, username, email, password, role, bio, link){
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.bio = bio;
        this.link = link;
    }

    static async getUserByUsername(username){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * from Users where username = @username`;
        const request =  connection.request();
        request.input('username',sql.VarChar,username);
        const result =  await request.query(sqlQuery);
        connection.close();

        return result.recordset[0] 
        ? new User(
            result.recordset[0].id,
            result.recordset[0].username,
            result.recordset[0].email,
            result.recordset[0].password,
            result.recordset[0].role,
            result.recordset[0].bio,
            result.recordset[0].link,
        )
        : null;
    } 
    static async createUser(newUserData){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Users (username, email, password, role) VALUES(@username,@email,@password,@role); SELECT SCOPE_IDENTITY() as id`

        const request = connection.request();
        request.input('username',sql.VarChar,newUserData.username);
        request.input('email',sql.VarChar,newUserData.email);
        request.input('password',sql.VarChar,newUserData.password);
        request.input('role',sql.VarChar,newUserData.role || 'user');

        const result = await request.query(sqlQuery);
        connection.close();
        if (result.recordset.length === 0){
            throw new Error("Failed to create User");
        }
        return this.getUserByUsername(newUserData.username);
    }
    static async updateUser(username, newUserData){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Users SET username =  @username, email = @email, bio = @bio, link = @link WHERE username = ${username}`;
        const request = connection.request();
        request.input("username",newUserData.username);
        request.input("email",newUserData.email);
        request.input("bio",newUserData.bio);
        request.input("link",newUserData.link);

        await request.query(sqlQuery);
        connection.close();
        if (result.recordset.length === 0){
            throw new Error("Failed to update User");
        }
        return this.getUserByUsername(newUserData.username);
    }
}
module.exports = User;