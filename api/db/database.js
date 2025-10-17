const mysql = require("mysql2");
const http = require("http");
const dbDetails = require("./db-details");

module.exports = {
    getConnection: () => {
        return mysql.createConnection({
            host: dbDetails.host,
            user: dbDetails.user,
            password: dbDetails.password,
            database: dbDetails.database
        });
    }
}