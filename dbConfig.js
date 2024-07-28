require('dotenv').config();

module.exports = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    trustServerCertificate: process.env.TRUST_SERVER_CERTIFICATE === 'true',
    options: {
        port: parseInt(process.env.PORT),
        connectionTimeout: parseInt(process.env.CONNECTION_TIMEOUT)
    }
}
