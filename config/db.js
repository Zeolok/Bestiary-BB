const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678FIB',
    database: 'bdnode',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;