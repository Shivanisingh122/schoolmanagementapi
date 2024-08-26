const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: 'root',  // Your MySQL password
    database: 'school_management'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = db;
