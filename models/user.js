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
    //for searching users later
    static async getAllUsers(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT username from Users`
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close()
        return result.recordset.map(user => user.username);
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
        const sqlQuery = `UPDATE Users SET username =  @newUsername, email = @newEmail, bio = @newBio, link = @newLink WHERE username = @username`;
        const request = connection.request();
        request.input("username",username); //looking for signed in user's current username
        request.input("newUsername",newUserData.username);
        request.input("newEmail",newUserData.email);
        request.input("newBio",newUserData.bio);
        request.input("newLink",newUserData.link);

        const result = await request.query(sqlQuery);
        connection.close();
        if (result.rowsAffected[0] === 0){
            throw new Error("Failed to update User");
        }
        return this.getUserByUsername(newUserData.username);
    }
    static async deleteUser(username){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Users WHERE username = @username`;
        const request = connection.request();
        request.input('username', sql.VarChar, username);
        const result = await request.query(sqlQuery);
        connection.close();

        return result.rowsAffected > 0; // returns bool to indicate if user was deleted.
    }
}
module.exports = User;