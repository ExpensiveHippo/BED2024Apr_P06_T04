require('dotenv').config();

module.exports = {
    user: "sa",
    password: "1234567890",
    server: "localhost",
    database: "bed_db_asg",
    trustServerCertificate: true,
    options: {
        port: 1433,
        connectionTimeout: 60000,
    }
}