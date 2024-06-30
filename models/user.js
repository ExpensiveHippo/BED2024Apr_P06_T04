const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User{
    constructor(id, username, email, password){
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
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
            result.recordset[0].password
        )
        : null;
    } 
    static async createUser(newUserData){
        try{
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `INSERT INTO Users (username, email, password) VALUES(@username,@email,@password); SELECT SCOPE_IDENTITY() as id`

            const request = connection.request();
            request.input('username',sql.VarChar,newUserData.username);
            request.input('email',sql.VarChar,newUserData.email);
            request.input('password',sql.VarChar,newUserData.password);

            const result = await request.query(sqlQuery);
            connection.close();
            if (result.recordset.length === 0){
                throw new Error("Failed to create User");
            }
            return this.getUserByUsername(newUserData.username);
        }
        catch(error){
            if(error.number === 2627 || error.number === 2601){
                throw new Error("Username already exists");
            }
            else{
                console.error(error);
                throw error;
            }
        }
    }
}
module.exports = User;